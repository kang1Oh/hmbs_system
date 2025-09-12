const express = require('express');
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv'); 
const router = express.Router();
const { tools } = require('../models/db');

// ✅ GET all tools
router.get('/', (req, res) => {
  tools.find({}, (err, docs) => {
    if (err) return res.status(500).json({ error: err });
    res.json(docs);
  });
});

// ✅ GET tool by numeric tool_id
router.get('/numeric/:tool_id', (req, res) => {
  tools.findOne({ tool_id: req.params.tool_id }, (err, doc) => {
    if (err) return res.status(500).json({ error: err });
    if (!doc) return res.status(404).json({ message: 'Tool not found' });
    res.json(doc);
  });
});

// ✅ GET tool by NeDB _id
router.get('/:id', (req, res) => {
  tools.findOne({ _id: req.params.id }, (err, doc) => {
    if (err) return res.status(500).json({ error: err });
    if (!doc) return res.status(404).json({ message: 'Tool not found' });
    res.json(doc);
  });
});

// ✅ CREATE tool
router.post('/', (req, res) => {
  const { tool_id } = req.body;

  if (!tool_id) {
    return res.status(400).json({ error: 'tool_id is required' });
  }

  tools.findOne({ tool_id: tool_id.toString().trim() }, (err, existingTool) => {
    if (err) return res.status(500).json({ error: err });
    if (existingTool) {
      return res.status(400).json({ error: 'Tool with this ID already exists' });
    }

    const newTool = {
      ...req.body,
      tool_id: tool_id.toString().trim(),
      createdAt: new Date()
    };

    tools.insert(newTool, (err, newDoc) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json(newDoc);
    });
  });
});

// ✅ UPDATE tool (by _id)
router.put('/:id', (req, res) => {
  tools.update(
    { _id: req.params.id },
    { $set: req.body },
    {},
    (err, numUpdated) => {
      if (err) return res.status(500).json({ error: err });
      if (numUpdated === 0) return res.status(404).json({ message: 'Tool not found' });
      res.json({ message: 'Tool updated successfully' });
    }
  );
});

// ✅ DELETE tool (by _id)
router.delete('/:id', (req, res) => {
  tools.remove({ _id: req.params.id }, {}, (err, numRemoved) => {
    if (err) return res.status(500).json({ error: err });
    if (numRemoved === 0) return res.status(404).json({ message: 'Tool not found' });
    res.json({ message: 'Tool deleted successfully' });
  });
});

// 📤 EXPORT current DB to CSV and overwrite seeder CSV file
router.get('/export', (req, res) => {
  tools.find({}, (err, docs) => {
    if (err) return res.status(500).json({ error: err });

    const fields = [
      'tool_id',
      'category_id',
      'name',
      'available_qty',
      'unit',
      'price',
      'img',
      'quantity',
      'disposal_status',
      '_id'
    ];
    const parser = new Parser({ fields });
    const csv = parser.parse(docs);

    const csvPath = path.join(__dirname, '..', 'csv_files', 'tools.csv');
    try {
      fs.writeFileSync(csvPath, csv);
    } catch (e) {
      console.error('⚠️ Failed to write seed CSV:', e.message);
    }

    res.header('Content-Type', 'text/csv');
    res.attachment('tools.csv');
    res.send(csv);
  });
});

module.exports = router;
