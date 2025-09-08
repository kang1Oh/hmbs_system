// routes/borrow_requests_routes.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const router = express.Router();
const { borrowRequests, groups, borrowItems, users, tools } = require('../models/db');
const { findAsync, findOneAsync } = require('../helpers/dbAsync');

router.get('/', (req, res) => {
  borrowRequests.find({}, (err, docs) => {
    if (err) return res.status(500).json({ error: err });
    res.json(docs);
  });
});

router.get('/:id', (req, res) => {
  borrowRequests.findOne({ _id: req.params.id }, (err, doc) => {
    if (err) return res.status(500).json({ error: err });
    if (!doc) return res.status(404).json({ message: 'Request not found' });
    res.json(doc);
  });
});

router.post('/', (req, res) => {
  borrowRequests.insert(req.body, (err, newDoc) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json(newDoc);
  });
});

router.put('/:id', (req, res) => {
  borrowRequests.update({ _id: req.params.id }, { $set: req.body }, {}, (err, numUpdated) => {
    if (err) return res.status(500).json({ error: err });
    if (numUpdated === 0) return res.status(404).json({ message: 'Request not found' });
    res.json({ message: 'Request updated successfully' });
  });
});

router.delete('/:id', (req, res) => {
  borrowRequests.remove({ _id: req.params.id }, {}, (err, numRemoved) => {
    if (err) return res.status(500).json({ error: err });
    if (numRemoved === 0) return res.status(404).json({ message: 'Request not found' });
    res.json({ message: 'Request deleted successfully' });
  });
});

// Generate PDF slip (not downloadable yet)
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

    // Request Items
    const reqItems = await findAsync(borrowItems, { request_id: request._id });
    const fullItems = await Promise.all(
      reqItems.map((ri) => findOneAsync(tools, { tool_id: ri.tool_id }))
    );

    // Use request_slip_id for the filename
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
    doc.text(`Course: ${request.course}`);
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