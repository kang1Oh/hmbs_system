// routes/tools_routes.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const router = express.Router();
const pool = require('../models/db');
const upload = require('../middleware/upload');
const csv = require('csv-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });

// 📤 EXPORT all tools to CSV
router.get('/export', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tools ORDER BY tool_id ASC');
    const fields = [
      'tool_id',
      'category_id',
      'name',
      'location',
      'available_qty',
      'unit',
      'price',
      'img',
      'tool_status',
      'disposal_status',
      'nedb_id'
    ];
    const parser = new Parser({ fields });
    const csvData = parser.parse(rows);
    const csvPath = path.join(__dirname, '..', 'csv_exports', 'tools.csv');
    fs.writeFileSync(csvPath, csvData);
    res.header('Content-Type', 'text/csv');
    res.attachment('tools.csv');
    res.send(csvData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📥 IMPORT from CSV
router.post('/import', uploadMiddleware.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const requiredHeaders = [
    'category_id', 'name', 'location', 'available_qty',
    'unit', 'price', 'img', 'tool_status', 'disposal_status'
  ];

  const results = [];
  let headersValidated = false;

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('headers', (headers) => {
      const normalized = headers.map(h => h.trim().toLowerCase());
      const missing = requiredHeaders.filter(h => !normalized.includes(h.toLowerCase()));
      if (missing.length > 0) {
        fs.unlinkSync(req.file.path);
        res.status(400).json({ message: `Missing required columns: ${missing.join(', ')}` });
      } else headersValidated = true;
    })
    .on('data', (row) => {
      if (headersValidated) {
        results.push({
          category_id: Number(row.category_id),
          name: row.name,
          location: row.location,
          available_qty: Number(row.available_qty),
          unit: row.unit,
          price: Number(row.price),
          img: row.img && row.img.trim() !== '' ? row.img : '/uploads/tools/default.png',
          tool_status: row.tool_status || 'Available',
          disposal_status: row.disposal_status || 'Good Condition',
        });
      }
    })
    .on('end', async () => {
      fs.unlinkSync(req.file.path);
      if (results.length === 0) return res.status(400).json({ message: 'CSV file contained no valid rows' });

      try {
        const inserted = [];
        for (const tool of results) {
          const query = `
            INSERT INTO tools (category_id, name, location, available_qty, unit, price, img, tool_status, disposal_status)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING *;
          `;
          const values = [
            tool.category_id, tool.name, tool.location, tool.available_qty,
            tool.unit, tool.price, tool.img, tool.tool_status, tool.disposal_status
          ];
          const { rows } = await pool.query(query, values);
          inserted.push(rows[0]);
        }
        res.json({ message: `Imported ${inserted.length} tools successfully`, tools: inserted });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
});

// ✅ GET all tools
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tools ORDER BY tool_id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ CREATE tool
router.post('/', upload.single('image'), async (req, res) => {
  const { category_id, name, location, available_qty, unit, price, tool_status, disposal_status } = req.body;
  const imgPath = req.file
    ? `/uploads/tools/${req.file.filename}`
    : req.body.img?.trim() || '/uploads/tools/default.png';

  try {
    const query = `
      INSERT INTO tools (category_id, name, location, available_qty, unit, price, img, tool_status, disposal_status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *;
    `;
    const values = [category_id, name, location, available_qty, unit, price, imgPath, tool_status, disposal_status];
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET tool by numeric tool_id
router.get('/numeric/:tool_id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tools WHERE tool_id = $1', [req.params.tool_id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Tool not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE tool
router.put('/:tool_id', upload.single('image'), async (req, res) => {
  const { tool_id } = req.params;
  const updateData = { ...req.body };
  if (req.file) updateData.img = `/uploads/tools/${req.file.filename}`;

  const fields = Object.keys(updateData);
  const values = Object.values(updateData);

  const setClause = fields.map((f, i) => `${f}=$${i + 1}`).join(', ');

  try {
    const query = `UPDATE tools SET ${setClause} WHERE tool_id = $${fields.length + 1}`;
    await pool.query(query, [...values, tool_id]);
    res.json({ message: 'Tool updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE tool
router.delete('/:tool_id', async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM tools WHERE tool_id = $1', [req.params.tool_id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Tool not found' });
    res.json({ message: 'Tool deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
