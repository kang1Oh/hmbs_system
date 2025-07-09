// routes/statuses_routes.js
const express = require('express');
const router = express.Router();
const { statuses } = require('../models/db');

router.get('/', (req, res) => {
  statuses.find({}, (err, docs) => {
    if (err) return res.status(500).json({ error: err });
    res.json(docs);
  });
});

router.get('/:id', (req, res) => {
  statuses.findOne({ _id: req.params.id }, (err, doc) => {
    if (err) return res.status(500).json({ error: err });
    if (!doc) return res.status(404).json({ message: 'Status not found' });
    res.json(doc);
  });
});

router.post('/', (req, res) => {
  const { status_label } = req.body;
  if (!status_label) return res.status(400).json({ error: 'status_label is required' });

  statuses.insert({ status_label }, (err, newDoc) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json(newDoc);
  });
});

router.put('/:id', (req, res) => {
  statuses.update({ _id: req.params.id }, { $set: req.body }, {}, (err, numUpdated) => {
    if (err) return res.status(500).json({ error: err });
    if (numUpdated === 0) return res.status(404).json({ message: 'Status not found' });
    res.json({ message: 'Status updated successfully' });
  });
});

router.delete('/:id', (req, res) => {
  statuses.remove({ _id: req.params.id }, {}, (err, numRemoved) => {
    if (err) return res.status(500).json({ error: err });
    if (numRemoved === 0) return res.status(404).json({ message: 'Status not found' });
    res.json({ message: 'Status deleted successfully' });
  });
});

module.exports = router;
