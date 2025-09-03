// routes/categories_routes.js
const express = require('express');
const router = express.Router();
const { categories } = require('../models/db');

// Utility function to remove duplicates by category_id
function removeDuplicateCategories(docs) {
  const seen = new Set();
  return docs.filter(doc => {
    if (seen.has(doc.category_id)) return false;
    seen.add(doc.category_id);
    return true;
  });
}

// GET all categories (deduplicated)
router.get('/', (req, res) => {
  categories.find({}, (err, docs) => {
    if (err) return res.status(500).json({ error: err });
    const uniqueDocs = removeDuplicateCategories(docs);
    res.json(uniqueDocs);
  });
});

// GET category by MongoDB _id
router.get('/:id', (req, res) => {
  categories.findOne({ _id: req.params.id }, (err, doc) => {
    if (err) return res.status(500).json({ error: err });
    if (!doc) return res.status(404).json({ message: 'Category not found' });
    res.json(doc);
  });
});

// POST create new category
router.post('/', (req, res) => {
  const { category_id, category_name } = req.body;

  console.log('📥 Incoming body:', req.body);

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

// PUT update category
router.put('/:id', (req, res) => {
  categories.update({ _id: req.params.id }, { $set: req.body }, {}, (err, numUpdated) => {
    if (err) return res.status(500).json({ error: err });
    if (numUpdated === 0) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category updated successfully' });
  });
});

// DELETE category
router.delete('/:id', (req, res) => {
  categories.remove({ _id: req.params.id }, {}, (err, numRemoved) => {
    if (err) return res.status(500).json({ error: err });
    if (numRemoved === 0) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  });
});

module.exports = router;
