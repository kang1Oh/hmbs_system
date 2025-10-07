// routes/borrow_requests_routes.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const router = express.Router();
const { borrowRequests, groups, borrowItems, users, tools, approvals } = require('../models/db');
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

router.delete('/:id', (req, res) => {
  borrowRequests.remove({ _id: req.params.id }, {}, (err, numRemoved) => {
    if (err) return res.status(500).json({ error: err });
    if (numRemoved === 0) return res.status(404).json({ message: 'Request not found' });
    res.json({ message: 'Request deleted successfully' });
  });
});

// Generate PDF slip (unchanged, still relies on _id internally)
router.post('/:id/generate-pdf', async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await findOneAsync(borrowRequests, { _id: requestId });
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Groups
    const members = await findAsync(groups, { request_id: request._id });
    const leader = members.find((m) => m.is_leader);

    const leaderUser = leader ? await findOneAsync(users, { _id: leader.user_id }) : null;
    const memberUsers = await Promise.all(
      members
        .filter((m) => !m.is_leader)
        .map((m) => findOneAsync(users, { _id: m.user_id }))
    );

    //Instructor
    const instructorUser = await findOneAsync(users, { _id: request.instructor_id });

    // Request Items
    const reqItems = await findAsync(borrowItems, { request_id: request._id });
    const fullItems = await Promise.all(
      reqItems.map((ri) => findOneAsync(tools, { tool_id: ri.tool_id }))
    );

    const pdfPath = path.resolve(`./pdf/borrow_slip_${request.request_slip_id}.pdf`);
    console.log("PDF path:", pdfPath);

    fs.mkdirSync(path.dirname(pdfPath), { recursive: true });

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfPath));

    // Header
    doc.fontSize(18).text('Borrow Request Slip', { align: 'center' });
    doc.moveDown();

    // Request info
    doc.fontSize(12).text(`Slip ID: ${request.request_slip_id}`);
    doc.text(`Subject: ${request.subject}`);
    doc.text(`Instructor: ${instructorUser ? instructorUser.name : '(Not Found)'}`);
    doc.text(`Date Requested: ${request.date_requested}`);
    doc.text(`Date Use: ${request.lab_date} ${request.lab_time}`);
    doc.moveDown();

    // Group info
    doc.text(`Group Leader: ${leaderUser ? leaderUser.name : '(Not Found)'}`);
    doc.text('Group Members:');
    memberUsers.forEach((m, idx) => {
      doc.text(`  ${idx + 1}. ${m ? m.name : '(Not Found)'}`);
    });

    // Items
    doc.moveDown().text('Borrowed Items:');
    reqItems.forEach((ri, idx) => {
      const it = fullItems.find((f) => f && f.tool_id === ri.tool_id);
      doc.text(`  ${idx + 1}. ${it ? it.name : '(Not Found)'} - Qty: ${ri.requested_qty}`);
    });

    doc.end();

    res.json({ message: 'PDF generated successfully', path: pdfPath });
  } catch (err) {
    console.error("❌ PDF generation failed:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
