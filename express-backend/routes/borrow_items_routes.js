// routes/borrow_items_routes.js
const express = require('express');
const router = express.Router();
const { borrowItems } = require('../models/db');

router.get('/', (req, res) => {
  borrowItems.find({}, (err, docs) => {
    if (err) return res.status(500).json({ error: err });
    res.json(docs);
  });
});

router.get('/:id', (req, res) => {
  borrowItems.findOne({ _id: req.params.id }, (err, doc) => {
    if (err) return res.status(500).json({ error: err });
    if (!doc) return res.status(404).json({ message: 'Borrow item not found' });
    res.json(doc);
  });
});

router.post('/', (req, res) => {
  borrowItems.insert(req.body, (err, newDoc) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json(newDoc);
  });
});

router.put('/:id', (req, res) => {
  borrowItems.update({ _id: req.params.id }, { $set: req.body }, {}, (err, numUpdated) => {
    if (err) return res.status(500).json({ error: err });
    if (numUpdated === 0) return res.status(404).json({ message: 'Borrow item not found' });
    res.json({ message: 'Borrow item updated successfully' });
  });
});

router.delete('/:id', (req, res) => {
  borrowItems.remove({ _id: req.params.id }, {}, (err, numRemoved) => {
    if (err) return res.status(500).json({ error: err });
    if (numRemoved === 0) return res.status(404).json({ message: 'Borrow item not found' });
    res.json({ message: 'Borrow item deleted successfully' });
  });
});

module.exports = router;
