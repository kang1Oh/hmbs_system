// routes/approvals_routes.js
const express = require('express');
const router = express.Router();
const { approvals } = require('../models/db');

// 📤 EXPORT approvals DB to CSV into /csv_exports
router.get('/export', (req, res) => {
  approvals.find({}, (err, docs) => {
    if (err) return res.status(500).json({ error: err });

    const fields = [
      'request_id',
      'user_id',
      'name',
      'role_id',
      'status_id',
      'remarks',
      'date_approved',
      'nedb_id'
    ];
    const parser = new Parser({ fields });
    const csv = parser.parse(docs);

    const csvPath = path.join(__dirname, '..', 'csv_exports', 'approvals.csv');
    try {
      fs.writeFileSync(csvPath, csv);
    } catch (e) {
      console.error('⚠️ Failed to write export CSV:', e.message);
    }

    res.header('Content-Type', 'text/csv');
    res.attachment('approvals.csv');
    res.send(csv);
  });
});

router.get('/', (req, res) => {
  approvals.find({}, (err, docs) => {
    if (err) return res.status(500).json({ error: err });
    res.json(docs);
  });
});

router.get('/:id', (req, res) => {
  approvals.findOne({ _id: req.params.id }, (err, doc) => {
    if (err) return res.status(500).json({ error: err });
    if (!doc) return res.status(404).json({ message: 'Approval not found' });
    res.json(doc);
  });
});

router.post('/', (req, res) => {
  approvals.insert(req.body, (err, newDoc) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json(newDoc);
  });
});

router.put('/:id', (req, res) => {
  approvals.update({ _id: req.params.id }, { $set: req.body }, {}, (err, numUpdated) => {
    if (err) return res.status(500).json({ error: err });
    if (numUpdated === 0) return res.status(404).json({ message: 'Approval not found' });
    res.json({ message: 'Approval updated successfully' });
  });
});

router.delete('/:id', (req, res) => {
  approvals.remove({ _id: req.params.id }, {}, (err, numRemoved) => {
    if (err) return res.status(500).json({ error: err });
    if (numRemoved === 0) return res.status(404).json({ message: 'Approval not found' });
    res.json({ message: 'Approval deleted successfully' });
  });
});

module.exports = router;
