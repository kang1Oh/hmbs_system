// routes/groups_routes.js
const express = require('express');
const router = express.Router();
const { groups } = require('../models/db');

router.get('/', (req, res) => {
  groups.find({}, (err, docs) => {
    if (err) return res.status(500).json({ error: err });
    res.json(docs);
  });
});

router.get('/:id', (req, res) => {
  groups.findOne({ _id: req.params.id }, (err, doc) => {
    if (err) return res.status(500).json({ error: err });
    if (!doc) return res.status(404).json({ message: 'Group not found' });
    res.json(doc);
  });
});

// GET all group members for a given request_id
router.get('/request/:requestId', (req, res) => {
  groups.find({ request_id: req.params.requestId }, (err, docs) => {
    if (err) return res.status(500).json({ error: err });
    res.json(docs);
  });
});

router.post('/', (req, res) => {
  groups.insert(req.body, (err, newDoc) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json(newDoc);
  });
});

router.put('/:id', (req, res) => {
  groups.update({ _id: req.params.id }, { $set: req.body }, {}, (err, numUpdated) => {
    if (err) return res.status(500).json({ error: err });
    if (numUpdated === 0) return res.status(404).json({ message: 'Group not found' });
    res.json({ message: 'Group updated successfully' });
  });
});

router.delete('/:id', (req, res) => {
  groups.remove({ _id: req.params.id }, {}, (err, numRemoved) => {
    if (err) return res.status(500).json({ error: err });
    if (numRemoved === 0) return res.status(404).json({ message: 'Group not found' });
    res.json({ message: 'Group deleted successfully' });
  });
});

module.exports = router;