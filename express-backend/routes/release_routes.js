// routes/releases_routes.js
const express = require('express');
const router = express.Router();
const { releases } = require('../models/db');

router.get('/', (req, res) => {
  releases.find({}, (err, docs) => {
    if (err) return res.status(500).json({ error: err });
    res.json(docs);
  });
});

router.post('/', (req, res) => {
  releases.insert(req.body, (err, newDoc) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json(newDoc);
  });
});

router.get('/:id', (req, res) => {
  releases.findOne({ _id: req.params.id }, (err, doc) => {
    if (err) return res.status(500).json({ error: err });
    if (!doc) return res.status(404).json({ message: 'Release not found' });
    res.json(doc);
  });
});

router.put('/:id', (req, res) => {
  releases.update({ _id: req.params.id }, { $set: req.body }, {}, (err, numUpdated) => {
    if (err) return res.status(500).json({ error: err });
    if (numUpdated === 0) return res.status(404).json({ message: 'Release not found' });
    res.json({ message: 'Release updated successfully' });
  });
});

router.delete('/:id', (req, res) => {
  releases.remove({ _id: req.params.id }, {}, (err, numRemoved) => {
    if (err) return res.status(500).json({ error: err });
    if (numRemoved === 0) return res.status(404).json({ message: 'Release not found' });
    res.json({ message: 'Release deleted successfully' });
  });
});

module.exports = router;