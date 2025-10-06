// routes/returns_routes.js
const express = require('express');
const router = express.Router();
const { returns } = require('../models/db');

// Get all
router.get('/', (req, res) => {
  returns.find({}, (err, docs) => {
    if (err) return res.status(500).json({ error: err });
    res.json(docs);
  });
});

// Create
router.post('/', (req, res) => {
  returns.insert(req.body, (err, newDoc) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json(newDoc);
  });
});

// Get one
router.get('/:id', (req, res) => {
  returns.findOne({ _id: req.params.id }, (err, doc) => {
    if (err) return res.status(500).json({ error: err });
    if (!doc) return res.status(404).json({ message: 'Return not found' });
    res.json(doc);
  });
});

// Update
router.put('/:id', (req, res) => {
  returns.update({ _id: req.params.id }, { $set: req.body }, {}, (err, numUpdated) => {
    if (err) return res.status(500).json({ error: err });
    if (numUpdated === 0) return res.status(404).json({ message: 'Return not found' });
    res.json({ message: 'Return updated successfully' });
  });
});

// Delete
router.delete('/:id', (req, res) => {
  returns.remove({ _id: req.params.id }, {}, (err, numRemoved) => {
    if (err) return res.status(500).json({ error: err });
    if (numRemoved === 0) return res.status(404).json({ message: 'Return not found' });
    res.json({ message: 'Return deleted successfully' });
  });
});

module.exports = router;
