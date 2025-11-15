// routes/returns_routes.js
const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// GET all returns
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM returns ORDER BY return_id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE new return
router.post('/', async (req, res) => {
  const { request_id, tool_id, quantity, status, remarks, returned_to, return_date} = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO returns (request_id, tool_id, quantity, status, remarks, returned_to, return_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [request_id, tool_id, quantity, status, remarks, returned_to, return_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET return by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM returns WHERE return_id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Return not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE return
router.put('/:id', async (req, res) => {
  const { request_id, tool_id, quantity, status, remarks, returned_to, return_date} = req.body;
  try {
    const result = await pool.query(
      `UPDATE returns 
       SET request_id=$1, tool_id=$2, quantity=$3, status=$4, remarks=$5, returned_to=$6, return_date=$7
       WHERE return_id=$8
       RETURNING *`,
      [request_id, tool_id, quantity, status, remarks, returned_to, return_date, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Return not found' });
    res.json({ message: 'Return updated successfully', updated: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE return
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM returns WHERE return_id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Return not found' });
    res.json({ message: 'Return deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
