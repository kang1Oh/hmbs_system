// routes/borrow_items_routes.js
const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// ✅ GET all borrow items
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM borrow_items ORDER BY item_id ASC;');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST a new borrow item
router.post('/', async (req, res) => {
  try {
    const { request_id, tool_id, requested_qty} = req.body;
    const result = await pool.query(
      `INSERT INTO borrow_items (request_id, tool_id, requested_qty)
       VALUES ($1, $2, $3)
       RETURNING *;`,
      [request_id, tool_id, requested_qty]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET one borrow item by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM borrow_items WHERE item_id = $1;', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Borrow item not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE a borrow item by ID
router.put('/:id', async (req, res) => {
  try {
    const fields = ['request_id', 'tool_id', 'requested_qty'];
    const updates = [];
    const values = [];
    let idx = 1;

    for (const field of fields) {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = $${idx}`);
        values.push(req.body[field]);
        idx++;
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    values.push(req.params.id);
    const query = `UPDATE borrow_items SET ${updates.join(', ')} WHERE item_id = $${idx} RETURNING *;`;

    const result = await pool.query(query, values);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Borrow item not found' });

    res.json({ message: 'Borrow item updated successfully', updated: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE a borrow item by ID
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM borrow_items WHERE item_id = $1 RETURNING *;', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Borrow item not found' });
    res.json({ message: 'Borrow item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;