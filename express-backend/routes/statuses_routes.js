// routes/statuses_routes.js
const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// GET all statuses
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT status_id AS id, status_label FROM statuses ORDER BY status_id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE a new status
router.post('/', async (req, res) => {
  const { status_label } = req.body;
  if (!status_label) return res.status(400).json({ error: 'status_label is required' });

  try {
    const result = await pool.query(
      'INSERT INTO statuses (status_label) VALUES ($1) RETURNING status_id AS id, status_label',
      [status_label]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single status by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT status_id AS id, status_label FROM statuses WHERE status_id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Status not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a status by ID
router.put('/:id', async (req, res) => {
  const { status_label } = req.body;
  if (!status_label) return res.status(400).json({ error: 'status_label is required' });

  try {
    const result = await pool.query(
      'UPDATE statuses SET status_label = $1 WHERE status_id = $2 RETURNING *',
      [status_label, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Status not found' });
    res.json({ message: 'Status updated successfully', updated: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a status by ID
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM statuses WHERE status_id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Status not found' });
    res.json({ message: 'Status deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
