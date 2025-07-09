// routes/approvals_routes.js
const express = require('express');
const router = express.Router();
const { approvals } = require('../models/db');

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
