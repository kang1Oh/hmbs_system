// routes/borrow_requests_routes.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const router = express.Router();
const pool = require('../models/db'); // use pg Pool instead of NeDB

// Helper: format DB rows
function formatRequest(row) {
  if (!row) return null;
  return {
    ...row,
    nedb_id: row.nedb_id || null,
  };
}

// ✅ GET all borrow requests
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM borrow_requests ORDER BY request_id DESC');
    res.json(result.rows.map(formatRequest));
  } catch (err) {
    console.error('Error fetching borrow requests:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET all requests for a specific user
router.get('/user/:user_id', async (req, res) => {
  const userId = parseInt(req.params.user_id);
  try {
    const result = await pool.query('SELECT * FROM borrow_requests WHERE user_id = $1', [userId]);
    res.json(result.rows.map(formatRequest));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET all borrow requests by group or direct user
router.get('/by-group-or-user/:user_id', async (req, res) => {
  const userId = req.params.user_id;
  try {
    // 1. Get all group memberships
    const memberships = await pool.query('SELECT request_id FROM groups WHERE user_id = $1', [userId]);
    const groupRequestIds = memberships.rows.map(m => m.request_id);

    // 2. Get requests via groups
    const groupRequests = groupRequestIds.length
      ? await pool.query('SELECT * FROM borrow_requests WHERE request_id = ANY($1)', [groupRequestIds])
      : { rows: [] };

    // 3. Direct user requests
    const numericId = parseInt(userId, 10);
    const directRequests = !isNaN(numericId)
      ? await pool.query('SELECT * FROM borrow_requests WHERE user_id = $1', [numericId])
      : { rows: [] };

    // 4. Merge + deduplicate
    const allRequests = [...groupRequests.rows, ...directRequests.rows];
    const unique = Array.from(new Map(allRequests.map(r => [r.request_id, r])).values());

    res.json(unique.map(formatRequest));
  } catch (err) {
    console.error('Error in by-group-or-user route:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET new requests for an instructor (status_id = 1)
router.get('/instructor/:instructor_id/new', async (req, res) => {
  const instructorId = parseInt(req.params.instructor_id);
  try {
    // find pending requests assigned to instructor
    const requests = await pool.query(
      'SELECT * FROM borrow_requests WHERE instructor_id = $1 AND status_id = 1',
      [instructorId]
    );

    const enriched = await Promise.all(
      requests.rows.map(async (reqRow) => {
        // approval check
        const approval = await pool.query(
          'SELECT * FROM approvals WHERE request_id = $1 AND user_id = $2 AND status_id IN (2,6) LIMIT 1',
          [reqRow.request_id, instructorId]
        );

        // student info
        const student = await pool.query('SELECT name FROM users WHERE user_id = $1 LIMIT 1', [reqRow.user_id]);

        let statusLabel = 'New';
        if (approval.rowCount > 0) {
          statusLabel = approval.rows[0].status_id === 2 ? 'Approved' : 'Denied';
        }

        return {
          ...formatRequest(reqRow),
          student_name: student.rowCount ? student.rows[0].name : 'Unknown',
          status: statusLabel,
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    console.error('Error in instructor route:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET new requests for program head review
router.get('/programhead/new', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store');

    // Requests where instructor (role 2) approved (status 2)
    const query = `
      SELECT 
        br.request_id,
        br.request_slip_id,
        br.subject,
        br.date_requested,
        u.name AS student_name,
        CASE
          WHEN ph.status_id = 2 THEN 'Approved'
          WHEN ph.status_id = 6 THEN 'Denied'
          ELSE 'New'
        END AS status
      FROM borrow_requests br
      JOIN approvals ia 
        ON ia.request_id = br.request_id 
        AND ia.role_id = 2 
        AND ia.status_id = 2
      LEFT JOIN approvals ph 
        ON ph.request_id = br.request_id 
        AND ph.role_id = 3
        AND ph.status_id IN (2,6)
      JOIN users u 
        ON u.user_id = br.user_id
      WHERE br.status_id = 1
      ORDER BY br.date_requested DESC;
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching program head requests:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET requests ready for admin processing
router.get('/for-admin', async (req, res) => {
  try {
    const query = `
      SELECT 
        br.request_id,
        br.request_slip_id,
        br.subject,
        br.date_requested,
        br.status_id,
        u.name AS student_name,
        CASE
          WHEN br.status_id = 6 THEN 'Denied'
          WHEN br.status_id IN (2,3,4) THEN 'On-Going'
          WHEN br.status_id = 5 THEN 'Completed'
          ELSE 'New'
        END AS status
      FROM borrow_requests br
      JOIN users u ON u.user_id = br.user_id
      WHERE br.request_id IN (
        SELECT request_id FROM approvals WHERE role_id = 2 AND status_id = 2
      )
      AND br.request_id IN (
        SELECT request_id FROM approvals WHERE role_id = 3 AND status_id = 2
      )
      AND (br.status_id IS DISTINCT FROM 5)
      ORDER BY br.date_requested DESC;
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error in /for-admin route:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// ✅ GET completed borrow requests for admin
router.get('/completed', async (req, res) => {
  try {
    const query = `
      SELECT 
        br.request_id,
        br.request_slip_id,
        br.subject,
        br.date_requested,
        u.name AS student_name,
        'Completed' AS status
      FROM borrow_requests br
      JOIN users u ON u.user_id = br.user_id
      WHERE br.status_id = 5
      ORDER BY br.date_requested DESC;
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error in /completed route:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// ✅ CREATE a new borrow request
router.post('/', async (req, res) => {
  try {
    const { user_id, status_id, request_slip_id, lab_date, date_requested, lab_time, subject, instructor_id } = req.body;

    const query = `
      INSERT INTO borrow_requests (user_id, status_id, request_slip_id, lab_date, date_requested, lab_time, subject, instructor_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [user_id, status_id, request_slip_id, lab_date, date_requested, lab_time, subject, instructor_id];
    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating borrow request:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE all denied requests
router.delete('/denied/all', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM borrow_requests WHERE status_id = 6 RETURNING *;');
    if (result.rowCount === 0)
      return res.status(404).json({ message: 'No denied requests found' });

    res.json({ message: `${result.rowCount} denied requests deleted successfully` });
  } catch (err) {
    console.error('Error deleting denied requests:', err);
    res.status(500).json({ error: err.message });
  }
});

//Moved all routes requiring :id to the bottom to avoid route conflicts
// ✅ GET a specific request by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM borrow_requests WHERE request_id = $1;', [req.params.id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Request not found' });

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching request:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE a specific request by ID
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) return res.status(400).json({ message: 'No fields to update' });

    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    const query = `UPDATE borrow_requests SET ${setClause} WHERE request_id = $${fields.length + 1} RETURNING *;`;

    const result = await pool.query(query, [...values, req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Request not found' });

    res.json({ message: 'Request updated successfully', updated: result.rows[0] });
  } catch (err) {
    console.error('Error updating request:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE a specific request by ID
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM borrow_requests WHERE request_id = $1 RETURNING *;', [req.params.id]);
    if (result.rowCount === 0)
      return res.status(404).json({ message: 'Request not found' });

    res.json({ message: 'Request deleted successfully' });
  } catch (err) {
    console.error('Error deleting request:', err);
    res.status(500).json({ error: err.message });
  }
});

// Generate Student Copy PDF
router.post('/:id/generate-pdf-student', async (req, res) => {
  try {
    const requestId = req.params.id;

    // Fetch request + instructor + student
    const requestQuery = `
      SELECT br.*, 
             u.name AS student_name, 
             ins.name AS instructor_name
      FROM borrow_requests br
      LEFT JOIN users u ON br.user_id = u.user_id
      LEFT JOIN users ins ON br.instructor_id = ins.user_id
      WHERE br.request_id = $1;
    `;
    const requestRes = await pool.query(requestQuery, [requestId]);
    const request = requestRes.rows[0];
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Fetch group members
    const groupRes = await pool.query('SELECT * FROM groups WHERE request_id = $1;', [requestId]);
    const members = groupRes.rows;

    // Leader and members
    const leader = members.find(m => m.is_leader);
    const leaderUser = leader
      ? (await pool.query('SELECT * FROM users WHERE user_id = $1;', [leader.user_id])).rows[0]
      : null;
    const memberUsers = (await Promise.all(
      members.filter(m => !m.is_leader).map(m => pool.query('SELECT * FROM users WHERE user_id = $1;', [m.user_id]))
    )).map(r => r.rows[0]);

    const instructorUser = request.instructor_id
      ? (await pool.query('SELECT * FROM users WHERE user_id = $1;', [request.instructor_id])).rows[0]
      : null;

    // Borrowed items + tools
    const itemRes = await pool.query(
      'SELECT bi.*, t.name AS tool_name, t.tool_id FROM borrow_items bi JOIN tools t ON bi.tool_id = t.tool_id WHERE bi.request_id = $1;',
      [requestId]
    );
    const reqItems = itemRes.rows;
    const fullItems = reqItems.map(r => ({ tool_id: r.tool_id, name: r.tool_name }));

    // Custodian + Program Head
    const custodian = (await pool.query('SELECT * FROM users WHERE role_id = 1 LIMIT 1;')).rows[0];
    const programHead = (await pool.query('SELECT * FROM users WHERE role_id = 3 LIMIT 1;')).rows[0];

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
    const labDate = request.lab_date
      ? new Date(request.lab_date).toISOString().split('T')[0]
      : '';
    doc.text(
      `Date Requested: ${dateRequested}        Date Use: ${labDate}        Time: ${request.lab_time || ''}`,
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

    const requestRes = await pool.query(
      `SELECT br.*, u.name AS student_name, ins.name AS instructor_name
       FROM borrow_requests br
       LEFT JOIN users u ON br.user_id = u.user_id
       LEFT JOIN users ins ON br.instructor_id = ins.user_id
       WHERE br.request_id = $1;`,
      [requestId]
    );
    const request = requestRes.rows[0];
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const members = (await pool.query('SELECT * FROM groups WHERE request_id = $1;', [requestId])).rows;
    const leader = members.find(m => m.is_leader);
    const leaderUser = leader
      ? (await pool.query('SELECT * FROM users WHERE user_id = $1;', [leader.user_id])).rows[0]
      : null;
    const memberUsers = (await Promise.all(
      members.filter(m => !m.is_leader).map(m => pool.query('SELECT * FROM users WHERE user_id = $1;', [m.user_id]))
    )).map(r => r.rows[0]);

    const instructorUser = request.instructor_id
      ? (await pool.query('SELECT * FROM users WHERE user_id = $1;', [request.instructor_id])).rows[0]
      : null;

    const itemRes = await pool.query(
      'SELECT bi.*, t.name AS tool_name, t.tool_id FROM borrow_items bi JOIN tools t ON bi.tool_id = t.tool_id WHERE bi.request_id = $1;',
      [requestId]
    );
    const reqItems = itemRes.rows;
    const fullItems = reqItems.map(r => ({ tool_id: r.tool_id, name: r.tool_name }));
    
    const releaseData = (await pool.query('SELECT * FROM releases WHERE request_id = $1;', [requestId])).rows[0];
    const returnData = (await pool.query('SELECT * FROM returns WHERE request_id = $1;', [requestId])).rows;

    const custodian = (await pool.query('SELECT * FROM users WHERE role_id = 1 LIMIT 1;')).rows[0];
    const programHead = (await pool.query('SELECT * FROM users WHERE role_id = 3 LIMIT 1;')).rows[0];

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
    const labDate = request.lab_date
      ? new Date(request.lab_date).toISOString().split('T')[0]
      : '';
    doc.text(
      `Date Requested: ${dateRequested}        Date Use: ${labDate}        Time: ${request.lab_time || ''}`,
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
