// routes/borrow_requests_routes.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const router = express.Router();
const { borrowRequests, groups, borrowItems, users, tools, approvals, releases, returns } = require('../models/db');
const { findAsync, findOneAsync } = require('../helpers/dbAsync');

// 🧹 Helper: normalize response with nedb_id included
function formatRequest(doc) {
  if (!doc) return null;
  return {
    ...doc,
    nedb_id: doc._id, // expose NeDB's generated ID
  };
}

router.get('/', (req, res) => {
  borrowRequests.find({}, (err, docs) => {
    if (err) return res.status(500).json({ error: err });
    res.json(docs.map(formatRequest));
  });
});

// GET all requests for a specific user
router.get('/user/:user_id', (req, res) => {
  const userId = parseInt(req.params.user_id);
  borrowRequests.find({ user_id: userId }, (err, docs) => {
    if (err) return res.status(500).json({ error: err });
    res.json(docs.map(formatRequest));
  });
});

// GET all borrow requests for a user (direct + group membership, focusing on groups first)
router.get('/by-group-or-user/:user_id', async (req, res) => {
  try {
    const userId = req.params.user_id; 

    // 1. Find all group memberships by user_id (string, matches users._id)
    const memberships = await new Promise((resolve, reject) => {
      groups.find({ user_id: userId }, (err, docs) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });

    // 2. Collect request_ids from group memberships
    const groupRequestIds = memberships.map(m => m.request_id);

    let groupRequests = [];
    if (groupRequestIds.length > 0) {
      groupRequests = await new Promise((resolve, reject) => {
        borrowRequests.find({ _id: { $in: groupRequestIds } }, (err, docs) => {
          if (err) reject(err);
          else resolve(docs);
        });
      });
    }

    // 3. Also check if user submitted direct requests (numeric ID)
    const numericId = parseInt(userId, 10);
    let directRequests = [];
    if (!isNaN(numericId)) {
      directRequests = await new Promise((resolve, reject) => {
        borrowRequests.find({ user_id: numericId }, (err, docs) => {
          if (err) reject(err);
          else resolve(docs);
        });
      });
    }

    // 4. Merge results (avoid duplicates)
    const allRequests = [...groupRequests, ...directRequests];
    const unique = Array.from(new Map(allRequests.map(r => [r._id, r])).values());

    res.json(unique.map(formatRequest));
  } catch (err) {
    console.error("Error in by-group-or-user route:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET new or processed requests for a specific instructor
router.get('/instructor/:instructor_id/new', async (req, res) => {
  const instructorId = req.params.instructor_id;

  try {
    const requests = await new Promise((resolve, reject) => {
      borrowRequests.find({ instructor_id: instructorId, status_id: 1 }, (err, docs) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });

    const enriched = await Promise.all(
      requests.map(async (req) => {
        // check for approval (approved or rejected)
        const approval = await new Promise((resolve) => {
          approvals.findOne(
            {
              request_id: req._id,
              user_id: instructorId,
              status_id: { $in: [2, 6] },
            },
            (err, doc) => resolve(doc || null)
          );
        });

        // get student name
        const student = await new Promise((resolve) => {
          users.findOne({ _id: req.user_id }, (err, doc) => resolve(doc || null));
        });

        // determine label
        let statusLabel = "New";
        if (approval) {
          statusLabel = approval.status_id === 2 ? "Approved" : "Denied";
        }

        return {
          ...formatRequest(req),
          student_name: student ? student.name : "Unknown",
          status: statusLabel,
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    console.error("Error in instructor route:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/programhead/new', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store'); // avoid 304 caching

    // Step 1: find requests approved by an instructor
    const instructorApproved = await new Promise((resolve, reject) => {
      approvals.find(
        { role_id: { $in: [2, "2"] }, status_id: { $in: [2, "2"] } },
        (err, docs) => {
          if (err) reject(err);
          else resolve(docs.map((d) => d.request_id));
        }
      );
    });

    // Step 2: find matching borrow requests that are still pending
    const requests = await new Promise((resolve, reject) => {
      borrowRequests.find(
        { _id: { $in: instructorApproved }, status_id: { $in: [1, "1"] } },
        (err, docs) => {
          if (err) reject(err);
          else resolve(docs);
        }
      );
    });

    // Step 3: enrich with student name + program head approval status
    const enriched = await Promise.all(
      requests.map(async (req) => {
        const progApproved = await new Promise((resolve) => {
          approvals.findOne(
            { 
              request_id: req._id, 
              role_id: { $in: [3, "3"] }, 
              status_id: { $in: [2, 6, "2", "6"] } 
            },
            (err, doc) => resolve(doc || null)
          );
        });

        const student = await new Promise((resolve) => {
          users.findOne({ _id: req.user_id }, (err, doc) => resolve(doc || null));
        });

        let statusLabel = "New";
        if (progApproved) {
          if (progApproved.status_id == 2 || progApproved.status_id === "2") {
            statusLabel = "Approved";
          } else if (progApproved.status_id == 6 || progApproved.status_id === "6") {
            statusLabel = "Denied";
          }
        }

        return {
          request_slip_id: req.request_slip_id,
          student_name: student ? student.name : "Unknown",
          subject: req.subject,
          date_requested: req.date_requested,
          status: statusLabel,
          _id: req._id, 
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    console.error("Error fetching program head requests:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET requests for Admin
router.get('/for-admin', async (req, res) => {
  try {
    const [borrowDocs, approvalDocs] = await Promise.all([
      new Promise((resolve, reject) =>
        borrowRequests.find({}, (err, docs) => (err ? reject(err) : resolve(docs)))
      ),
      new Promise((resolve, reject) =>
        approvals.find({}, (err, docs) => (err ? reject(err) : resolve(docs)))
      ),
    ]);

    const instructorApproved = new Set(
      approvalDocs
        .filter(a => a.role_id == 2 && a.status_id == 2)
        .map(a => a.request_id)
    );
    const progHeadApproved = new Set(
      approvalDocs
        .filter(a => a.role_id == 3 && a.status_id == 2)
        .map(a => a.request_id)
    );
    const adminApproved = new Set(
      approvalDocs
        .filter(a => a.role_id == 1 && a.status_id == 2)
        .map(a => a.request_id)
    );

    const filtered = borrowDocs.filter(req =>
      instructorApproved.has(req._id) && progHeadApproved.has(req._id) && req.status_id !== 5
    );

    const enriched = await Promise.all(
      filtered.map(async (req) => {
        const student = await new Promise((resolve) =>
          users.findOne({ _id: req.user_id }, (err, doc) => resolve(doc || null))
        );

        let status = 'New';
        if (req.status_id === 6) status = 'Denied';
        else if ([2, 3, 4].includes(req.status_id)) status = 'On-Going';
        else if ([5].includes(req.status_id)) status = 'Completed';

        return {
          request_slip_id: req.request_slip_id,
          student_name: student ? student.name : 'Unknown',
          subject: req.subject,
          date_requested: req.date_requested,
          status,
          status_id: req.status_id,
          _id: req._id,
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    console.error('Error in /for-admin route:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// ✅ GET completed requests for Admin
router.get('/completed', async (req, res) => {
  try {
    const borrowDocs = await new Promise((resolve, reject) =>
      borrowRequests.find({ status_id: 5 }, (err, docs) => (err ? reject(err) : resolve(docs)))
    );

    const enriched = await Promise.all(
      borrowDocs.map(async (req) => {
        const student = await new Promise((resolve) =>
          users.findOne({ _id: req.user_id }, (err, doc) => resolve(doc || null))
        );

        return {
          request_slip_id: req.request_slip_id,
          student_name: student ? student.name : 'Unknown',
          subject: req.subject,
          date_requested: req.date_requested,
          status: 'Completed',
          _id: req._id, 
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    console.error('Error in /completed route:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});


router.post('/', (req, res) => {
  borrowRequests.insert(req.body, (err, newDoc) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json(formatRequest(newDoc));
  });
});

router.get('/:id', (req, res) => {
  borrowRequests.findOne({ _id: req.params.id }, (err, doc) => {
    if (err) return res.status(500).json({ error: err });
    if (!doc) return res.status(404).json({ message: 'Request not found' });
    res.json(formatRequest(doc));
  });
});

router.put('/:id', (req, res) => {
  borrowRequests.update(
    { _id: req.params.id },
    { $set: req.body },
    {},
    (err, numUpdated) => {
      if (err) return res.status(500).json({ error: err });
      if (numUpdated === 0) return res.status(404).json({ message: 'Request not found' });
      res.json({ message: 'Request updated successfully' });
    }
  );
});

// DELETE all denied requests
router.delete('/denied/all', (req, res) => {
  borrowRequests.remove({ status_id: 6 }, { multi: true }, (err, numRemoved) => {
    if (err) return res.status(500).json({ error: err });
    if (numRemoved === 0) return res.status(404).json({ message: 'No denied requests found' });
    res.json({ message: `${numRemoved} denied requests deleted successfully` });
  });
});

// DELETE a specific request by ID
router.delete('/:id', (req, res) => {
  borrowRequests.remove({ _id: req.params.id }, {}, (err, numRemoved) => {
    if (err) return res.status(500).json({ error: err });
    if (numRemoved === 0) return res.status(404).json({ message: 'Request not found' });
    res.json({ message: 'Request deleted successfully' });
  });
});

// Generate Student Copy PDF
router.post('/:id/generate-pdf-student', async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await findOneAsync(borrowRequests, { _id: requestId });
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const members = await findAsync(groups, { request_id: request._id });
    const leader = members.find(m => m.is_leader);
    const leaderUser = leader ? await findOneAsync(users, { _id: leader.user_id }) : null;
    const memberUsers = await Promise.all(
      members.filter(m => !m.is_leader).map(m => findOneAsync(users, { _id: m.user_id }))
    );
    const instructorUser = await findOneAsync(users, { _id: request.instructor_id });
    const reqItems = await findAsync(borrowItems, { request_id: request._id });
    const fullItems = await Promise.all(reqItems.map(ri => findOneAsync(tools, { tool_id: ri.tool_id })));
    const custodian = await findOneAsync(users, { role_id: 1 });
    const programHead = await findOneAsync(users, { role_id: 3 });

    const pdfPath = path.resolve(`./pdf/borrow_slip_student_${request.request_slip_id}.pdf`);
    fs.mkdirSync(path.dirname(pdfPath), { recursive: true });
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(fs.createWriteStream(pdfPath));
    doc.font('Times-Roman');

    // Header
    doc.fontSize(10).text('Student’s Copy', { align: 'right' });
    doc.moveDown();
    doc.text('Republic of the Philippines', { align: 'center' });
    doc.text('University of Southeastern Philippines', { align: 'center' });
    doc.text('COLLEGE OF BUSINESS ADMINISTRATION', { align: 'center' });
    doc.text('Obrero, Davao City', { align: 'center' });
    doc.text('HOSPITALITY MANAGEMENT DEPARTMENT', { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(14).text('LABORATORY REQUISITION FORM', { align: 'center', underline: true });
    doc.moveDown(1.5);

    // Body text
    doc.fontSize(12);
    const bodyLeft = 70; // match footer colLeft
    const rightMargin = 70;
    const bodyWidth = doc.page.width - bodyLeft - rightMargin;

    const dateRequested = request.date_requested
      ? new Date(request.date_requested).toISOString().split('T')[0]
      : '';
    doc.text(
      `Date Requested: ${dateRequested}        Date Use: ${request.lab_date || ''}        Time: ${request.lab_time || ''}`,
      bodyLeft,
      doc.y,
      { width: bodyWidth }
    );
    doc.moveDown(0.7);
    doc.text(`Subject: ${request.subject || ''}`, bodyLeft, doc.y, { width: bodyWidth });
    doc.moveDown(0.7);
    doc.text(`Group Leader: ${leaderUser ? leaderUser.name : ''}`, bodyLeft, doc.y, { width: bodyWidth });
    doc.moveDown(0.7);
    doc.text('Group Members:', bodyLeft, doc.y, { width: bodyWidth });
    memberUsers.forEach((m, i) =>
      doc.text(`   ${i + 1}. ${m ? m.name : ''}`, bodyLeft + 10, doc.y, { width: bodyWidth - 10 })
    );
    doc.moveDown(1.2);

    // Items Table
    const startX = 70;
    let y = doc.y;
    const col1 = 70;
    const col2 = 160;
    const tableWidth = 450;
    const rowHeight = 20;

    doc.rect(startX, y, tableWidth, rowHeight).stroke();
    doc.text('QUANTITY', col1 + 10, y + 5);
    doc.text('DESCRIPTION', col2 + 10, y + 5);
    y += rowHeight;

    reqItems.forEach((ri) => {
      const it = fullItems.find(f => f && f.tool_id === ri.tool_id);
      doc.rect(startX, y, tableWidth, rowHeight).stroke();
      doc.text(String(ri.requested_qty || ''), col1 + 10, y + 5);
      doc.text(it ? it.name : '', col2 + 10, y + 5);
      y += rowHeight;
    });

    // Footer
    doc.moveDown(3);
    const footerTop = doc.y + 10;
    const colLeft = 70;
    const colRight = 400;
    doc.fontSize(11);

    // Layout three signature blocks horizontally: Program Head (left), Custodian (center), Instructor (right)
    const sectionWidth = 160; // width of each signature block
    const leftX = colLeft; // 70
    const centerX = (doc.page.width - sectionWidth) / 2;
    const rightX = colRight; // 400
    const lineY = footerTop + 12; // y for signature line

    // layout adjustments: program head center, custodian left, instructor right
    const signLineWidth = 120; // shorter signature lines so they don't intersect
    const nameY = lineY - 18; // place names above the signature line
    const titleY = lineY + 8; // titles below the signature line

    // Custodian (last)
    const custName = custodian ? custodian.name : 'Laboratory in Charge';
    const custX = rightX;
    const custLineStart = custX + (sectionWidth - signLineWidth) / 2;
    doc.text(custName, custX, nameY, { width: sectionWidth, align: 'center' });
    doc.moveTo(custLineStart, lineY).lineTo(custLineStart + signLineWidth, lineY).stroke();
    doc.text('Laboratory in Charge', custX, titleY, { width: sectionWidth, align: 'center' });

    // Program Head (center)
    const phName = programHead ? programHead.name : 'Program Head - BSHM';
    const phX = centerX;
    const phLineStart = phX + (sectionWidth - signLineWidth) / 2;
    doc.text(phName, phX, nameY, { width: sectionWidth, align: 'center' });
    doc.moveTo(phLineStart, lineY).lineTo(phLineStart + signLineWidth, lineY).stroke();
    doc.text('Program Head – BSHM', phX, titleY, { width: sectionWidth, align: 'center' });

    // Instructor (first)
    const instrName = instructorUser ? instructorUser.name : 'Instructor';
    const instrX = leftX;
    const instrLineStart = instrX + (sectionWidth - signLineWidth) / 2;
    doc.text(instrName, instrX, nameY, { width: sectionWidth, align: 'center' });
    doc.moveTo(instrLineStart, lineY).lineTo(instrLineStart + signLineWidth, lineY).stroke();
    doc.text('Name of Instructor', instrX, titleY, { width: sectionWidth, align: 'center' });

    // Received / Returned — same baseline, Received on the right (first), Returned on the left (second)
    const rrY = lineY + 60; // place below signature lines
    const sigWidth = sectionWidth;

    // Returned (right) — draw line then label centered under it
    doc.moveTo(rightX, rrY).lineTo(rightX + sigWidth, rrY).stroke();
    doc.text('Returned by:', rightX, rrY + 6, { width: sigWidth, align: 'center' });

    // Received (left) — draw line then label centered under it
    doc.moveTo(leftX, rrY).lineTo(leftX + sigWidth, rrY).stroke();
    doc.text('Received by:', leftX, rrY + 6, { width: sigWidth, align: 'center' });

    doc.end();
    res.json({ message: 'Student copy generated', path: pdfPath });
  } catch (err) {
    console.error('PDF generation failed:', err);
    res.status(500).json({ error: err.message });
  }
});

// Generate Custodian Copy PDF
router.post('/:id/generate-pdf-custodian', async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await findOneAsync(borrowRequests, { _id: requestId });
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Fetch related data
    const members = await findAsync(groups, { request_id: request._id });
    const leader = members.find(m => m.is_leader);
    const leaderUser = leader ? await findOneAsync(users, { _id: leader.user_id }) : null;
    const memberUsers = await Promise.all(
      members.filter(m => !m.is_leader).map(m => findOneAsync(users, { _id: m.user_id }))
    );
    const instructorUser = await findOneAsync(users, { _id: request.instructor_id });
    const reqItems = await findAsync(borrowItems, { request_id: request._id });
    const fullItems = await Promise.all(reqItems.map(ri => findOneAsync(tools, { tool_id: ri.tool_id })));

    const releaseData = await findOneAsync(releases, { request_id: request._id });
    const returnData = await findAsync(returns, { request_id: request._id });

    const custodian = await findOneAsync(users, { role_id: 1 });
    const programHead = await findOneAsync(users, { role_id: 3 });

    const pdfPath = path.resolve(`./pdf/borrow_slip_custodian_${request.request_slip_id}.pdf`);
    fs.mkdirSync(path.dirname(pdfPath), { recursive: true });
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(fs.createWriteStream(pdfPath));
    doc.font('Times-Roman');

    // Header
    doc.fontSize(10).text('Custodian’s Copy', { align: 'right' });
    doc.moveDown();
    doc.text('Republic of the Philippines', { align: 'center' });
    doc.text('University of Southeastern Philippines', { align: 'center' });
    doc.text('COLLEGE OF BUSINESS ADMINISTRATION', { align: 'center' });
    doc.text('Obrero, Davao City', { align: 'center' });
    doc.text('HOSPITALITY MANAGEMENT DEPARTMENT', { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(14).text('LABORATORY REQUISITION FORM', { align: 'center', underline: true });
    doc.moveDown(1.5);

    // Body text
    doc.fontSize(12);
    const bodyLeft = 70;
    const rightMargin = 70;
    const bodyWidth = doc.page.width - bodyLeft - rightMargin;

    const dateRequested = request.date_requested
      ? new Date(request.date_requested).toISOString().split('T')[0]
      : '';
    doc.text(
      `Date Requested: ${dateRequested}        Date Use: ${request.lab_date || ''}        Time: ${request.lab_time || ''}`,
      bodyLeft,
      doc.y,
      { width: bodyWidth }
    );
    doc.moveDown(0.7);
    doc.text(`Subject: ${request.subject || ''}`, bodyLeft, doc.y, { width: bodyWidth });
    doc.moveDown(0.7);
    doc.text(`Group Leader: ${leaderUser ? leaderUser.name : ''}`, bodyLeft, doc.y, { width: bodyWidth });
    doc.moveDown(0.7);
    doc.text('Group Members:', bodyLeft, doc.y, { width: bodyWidth });
    memberUsers.forEach((m, i) =>
      doc.text(`   ${i + 1}. ${m ? m.name : ''}`, bodyLeft + 10, doc.y, { width: bodyWidth - 10 })
    );
    doc.moveDown(1.2);

    // Items Table
    const startX = 70;
    let y = doc.y;
    const colQty = 70;
    const colDesc = 130;
    const colOut = 340;
    const colIn = 400;
    const colRemarks = 460;
    const tableWidth = 500;
    const rowHeight = 20;

    // Header row
    doc.rect(startX, y, tableWidth, rowHeight).stroke();
    doc.fontSize(10).text('QUANTITY', colQty + 5, y + 5);
    doc.fontSize(10).text('DESCRIPTION', colDesc + 5, y + 5);
    doc.fontSize(10).text('OUT', colOut + 5, y + 5);
    doc.fontSize(10).text('IN', colIn + 5, y + 5);
    doc.fontSize(10).text('REMARKS', colRemarks + 5, y + 5);
    y += rowHeight;

    // Data rows with wrapping and remarks fix
    reqItems.forEach((ri) => {
      const it = fullItems.find(f => f && f.tool_id == ri.tool_id); // loose equals to handle string/number mismatch
      const ret = returnData.find(r => r.tool_id == ri.tool_id || r.tool_id == ri.tool_id);

      const outValue = releaseData && releaseData.release_date
      ? new Date(releaseData.release_date).toISOString().split('T')[0]
      : '';
      const inValue = ret && ret.return_date
      ? new Date(ret.return_date).toISOString().split('T')[0]
      : '';
      // prefer return remark, fall back to item/request remark if any
      const remarksValue = (ret && (ret.remarks || '')) || (ri.remarks || '');

      // compute widths for wrapping so text doesn't overflow into next column
      const tableEndX = startX + tableWidth;
      const descWidth = Math.max(50, colOut - colDesc - 10); // ensure some minimum
      const remarksWidth = Math.max(50, tableEndX - colRemarks - 10);

      doc.fontSize(10);
      // measure heights for wrapped text
      const qtyText = String(ri.requested_qty || '');
      const descText = it ? it.name : '';
      const outText = outValue;
      const inText = inValue;
      const remarksText = remarksValue;

      const descHeight = doc.heightOfString(descText, { width: descWidth });
      const remarksHeight = doc.heightOfString(remarksText, { width: remarksWidth });
      const qtyHeight = doc.heightOfString(qtyText, { width: colDesc - colQty - 10 });
      const outHeight = doc.heightOfString(outText, { width: colIn - colOut - 10 });
      const inHeight = doc.heightOfString(inText, { width: colRemarks - colIn - 10 });

      const cellPadding = 10;
      const computedRowHeight = Math.max(rowHeight, descHeight, remarksHeight, qtyHeight, outHeight, inHeight) + cellPadding;

      // draw row box using computed height
      doc.rect(startX, y, tableWidth, computedRowHeight).stroke();

      // write texts with wrapping within their column widths
      doc.text(qtyText, colQty + 5, y + 5, { width: colDesc - colQty - 10 });
      doc.text(descText, colDesc + 5, y + 5, { width: descWidth });
      doc.text(outText, colOut + 5, y + 5, { width: colIn - colOut - 10 });
      doc.text(inText, colIn + 5, y + 5, { width: colRemarks - colIn - 10 });
      doc.text(remarksText, colRemarks + 5, y + 5, { width: remarksWidth });

      y += computedRowHeight;
    });

    // Footer 
    doc.moveDown(3);
    const footerTop = doc.y + 10;
    const colLeft = 70;
    const colRight = 400;
    doc.fontSize(11);

    const sectionWidth = 160;
    const leftX = colLeft;
    const centerX = (doc.page.width - sectionWidth) / 2;
    const rightX = colRight;
    const lineY = footerTop + 12;
    const signLineWidth = 120;
    const nameY = lineY - 18;
    const titleY = lineY + 8;

    // Custodian
    const custName = custodian ? custodian.name : 'Laboratory in Charge';
    const custLineStart = rightX + (sectionWidth - signLineWidth) / 2;
    doc.text(custName, rightX, nameY, { width: sectionWidth, align: 'center' });
    doc.moveTo(custLineStart, lineY).lineTo(custLineStart + signLineWidth, lineY).stroke();
    doc.text('Laboratory in Charge', rightX, titleY, { width: sectionWidth, align: 'center' });

    // Program Head
    const phName = programHead ? programHead.name : 'Program Head - BSHM';
    const phLineStart = centerX + (sectionWidth - signLineWidth) / 2;
    doc.text(phName, centerX, nameY, { width: sectionWidth, align: 'center' });
    doc.moveTo(phLineStart, lineY).lineTo(phLineStart + signLineWidth, lineY).stroke();
    doc.text('Program Head – BSHM', centerX, titleY, { width: sectionWidth, align: 'center' });

    // Instructor
    const instrName = instructorUser ? instructorUser.name : 'Instructor';
    const instrLineStart = leftX + (sectionWidth - signLineWidth) / 2;
    doc.text(instrName, leftX, nameY, { width: sectionWidth, align: 'center' });
    doc.moveTo(instrLineStart, lineY).lineTo(instrLineStart + signLineWidth, lineY).stroke();
    doc.text('Name of Instructor', leftX, titleY, { width: sectionWidth, align: 'center' });

    // Received / Returned
    const rrY = lineY + 60;
    const sigWidth = sectionWidth;
    doc.moveTo(leftX, rrY).lineTo(leftX + sigWidth, rrY).stroke();
    doc.text('Received by:', leftX, rrY + 6, { width: sigWidth, align: 'center' });

    doc.moveTo(rightX, rrY).lineTo(rightX + sigWidth, rrY).stroke();
    doc.text('Returned by:', rightX, rrY + 6, { width: sigWidth, align: 'center' });

    doc.end();
    res.json({ message: 'Custodian copy generated', path: pdfPath });
  } catch (err) {
    console.error('PDF generation failed:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
