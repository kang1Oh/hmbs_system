// routes/borrow_requests_routes.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const router = express.Router();
const { borrowRequests, groups, borrowItems, users, tools } = require('../models/db');
const { findAsync, findOneAsync } = require('../helpers/dbAsync');

// 🧹 Helper: normalize response with nedb_id included
function formatRequest(doc) {
  if (!doc) return null;
  return {
    ...doc,
    nedb_id: doc._id, // expose NeDB's generated ID
  };
}

// 📤 EXPORT current DB to CSV into /csv_exports
router.get('/export', (req, res) => {
  borrowRequests.find({}, (err, docs) => {
    if (err) return res.status(500).json({ error: err });

    const fields = [
      'request_slip_id',
      'subject',
      'date_requested',
      'lab_date',
      'lab_time',
      'status',
      'instructor_id',
      'user_id',
      'status_id',
      '_id'
    ];
    const parser = new Parser({ fields });
    const csv = parser.parse(docs);

    const csvPath = path.join(__dirname, '..', 'csv_exports', 'borrow_requests.csv');
    try {
      fs.writeFileSync(csvPath, csv);
    } catch (e) {
      console.error('⚠️ Failed to write export CSV:', e.message);
    }

    res.header('Content-Type', 'text/csv');
    res.attachment('borrow_requests.csv');
    res.send(csv);
  });
});

router.get('/', (req, res) => {
  borrowRequests.find({}, (err, docs) => {
    if (err) return res.status(500).json({ error: err });
    res.json(docs.map(formatRequest));
  });
});

router.get('/:id', (req, res) => {
  borrowRequests.findOne({ _id: req.params.id }, (err, doc) => {
    if (err) return res.status(500).json({ error: err });
    if (!doc) return res.status(404).json({ message: 'Request not found' });
    res.json(formatRequest(doc));
  });
});

// GET all requests for a specific user
router.get('/user/:user_id', (req, res) => {
  const userId = parseInt(req.params.user_id, 10); // since you’re storing numeric IDs
  borrowRequests.find({ user_id: userId }, (err, docs) => {
    if (err) return res.status(500).json({ error: err });
    res.json(docs.map(formatRequest));
  });
});

// GET all requests for a user including group membership
router.get('/user-or-group/:user_id', async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id, 10);

    // direct requests
    const direct = await new Promise((resolve, reject) => {
      borrowRequests.find({ user_id: userId }, (err, docs) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });

    // group memberships
    const memberships = await new Promise((resolve, reject) => {
      groups.find({ user_id: userId }, (err, docs) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });

    let groupRequests = [];
    if (memberships.length > 0) {
      const requestIds = memberships.map((m) => m.request_id);
      groupRequests = await new Promise((resolve, reject) => {
        borrowRequests.find({ _id: { $in: requestIds } }, (err, docs) => {
          if (err) reject(err);
          else resolve(docs);
        });
      });
    }

    const all = [...direct, ...groupRequests];
    res.json(all.map(formatRequest));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all requests related to a user (as requester or group member)
// GET all borrow requests for a user (direct + group membership, focusing on groups first)
router.get('/by-group-or-user/:user_id', async (req, res) => {
  try {
    const userId = req.params.user_id; // careful: group.user_id stores _id (string), borrowRequests.user_id stores numeric

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


router.post('/', (req, res) => {
  borrowRequests.insert(req.body, (err, newDoc) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json(formatRequest(newDoc));
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
