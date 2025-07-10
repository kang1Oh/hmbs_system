// routes/categories_routes.js
const express = require('express');
const router = express.Router();
const { categories } = require('../models/db');

router.get('/', (req, res) => {
  categories.find({}, (err, docs) => {
    if (err) return res.status(500).json({ error: err });
    res.json(docs);
  });
});

router.get('/:id', (req, res) => {
  categories.findOne({ _id: req.params.id }, (err, doc) => {
    if (err) return res.status(500).json({ error: err });
    if (!doc) return res.status(404).json({ message: 'Category not found' });
    res.json(doc);
  });
});

router.post('/', (req, res) => {
  const { category_id, category_name } = req.body;

  console.log('📥 Incoming body:', req.body); // 🔍 Debug log

  if (!category_id || !category_name) {
    const missingFields = [];
    if (!category_id) missingFields.push('category_id');
    if (!category_name) missingFields.push('category_name');

    return res.status(400).json({
      error: `Missing required field(s): ${missingFields.join(', ')}`,
      received: req.body
    });
  }

  categories.insert({ category_id, category_name }, (err, newDoc) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json(newDoc);
  });
});


router.put('/:id', (req, res) => {
  categories.update({ _id: req.params.id }, { $set: req.body }, {}, (err, numUpdated) => {
    if (err) return res.status(500).json({ error: err });
    if (numUpdated === 0) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category updated successfully' });
  });
});

router.delete('/:id', (req, res) => {
  categories.remove({ _id: req.params.id }, {}, (err, numRemoved) => {
    if (err) return res.status(500).json({ error: err });
    if (numRemoved === 0) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  });
});

module.exports = router;
