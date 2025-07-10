const express = require('express');
const router = express.Router();
const { tools } = require('../models/db');

// GET all tools
router.get('/', (req, res) => {
  tools.find({}, (err, docs) => {
    if (err) return res.status(500).json({ error: err });
    res.json(docs);
  });
});

// GET tool by ID
router.get('/:id', (req, res) => {
  tools.findOne({ _id: req.params.id }, (err, doc) => {
    if (err) return res.status(500).json({ error: err });
    if (!doc) return res.status(404).json({ message: 'Tool not found' });
    res.json(doc);
  });
});

// CREATE tool
router.post('/', (req, res) => {
  const {
    tool_id,
    category_id,
    name,
    available_qty,
    unit,
    img,
    quantity
  } = req.body;

  // Validation
  if (!tool_id || !category_id || !name || available_qty == null || !unit || quantity == null) {
    console.log('❌ Missing data:', req.body); // Debug log
    return res.status(400).json({ error: 'All required fields must be provided' });
  }

  // Prepare new tool
  const newTool = {
    tool_id: tool_id.trim(),
    category_id: category_id.trim(),
    name: name.trim(),
    available_qty: Number(available_qty),
    unit: unit.trim(),
    img: img?.trim() || '',
    quantity: Number(quantity),
    createdAt: new Date()
  };

  // Insert into database
  tools.insert(newTool, (err, newDoc) => {
    if (err) return res.status(500).json({ error: err.message || err });
    res.status(201).json(newDoc);
  });
});


// UPDATE tool
router.put('/:id', (req, res) => {
  tools.update({ _id: req.params.id }, { $set: req.body }, {}, (err, numUpdated) => {
    if (err) return res.status(500).json({ error: err });
    if (numUpdated === 0) return res.status(404).json({ message: 'Tool not found' });
    res.json({ message: 'Tool updated successfully' });
  });
});

// DELETE tool
router.delete('/:id', (req, res) => {
  tools.remove({ _id: req.params.id }, {}, (err, numRemoved) => {
    if (err) return res.status(500).json({ error: err });
    if (numRemoved === 0) return res.status(404).json({ message: 'Tool not found' });
    res.json({ message: 'Tool deleted successfully' });
  });
});

module.exports = router;
