// routes/releases_routes.js
const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// ✅ GET all releases
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM releases ORDER BY release_id ASC;');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST create new release
router.post('/', async (req, res) => {
  try {
    const { request_id, released_by, release_date } = req.body;

    // verify referenced records exist
    const reqCheck = await pool.query(
      'SELECT 1 FROM borrow_requests WHERE request_id = $1',
      [request_id]
    );
    const userCheck = await pool.query(
      'SELECT 1 FROM users WHERE user_id = $1 AND active = true',
      [released_by]
    );

    if (reqCheck.rowCount === 0)
      return res.status(400).json({ error: 'Invalid request_id' });
    if (userCheck.rowCount === 0)
      return res.status(400).json({ error: 'Invalid or inactive released_by user' });

    const result = await pool.query(
      `INSERT INTO releases (request_id, released_by, release_date)
       VALUES ($1, $2, $3)
       RETURNING *;`,
      [request_id, released_by, release_date || new Date()]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating release:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET a release by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM releases WHERE release_id = $1;', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Release not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE a release by ID
router.put('/:id', async (req, res) => {
  try {
    const { request_id, released_by, release_date} = req.body;

    const result = await pool.query(
      `UPDATE releases
       SET request_id = $1,
           released_by = $2,
           release_date = $3
       WHERE release_id = $4
       RETURNING *;`,
      [request_id, released_by, release_date, req.params.id]
    );

    if (result.rowCount === 0) return res.status(404).json({ message: 'Release not found' });
    res.json({ message: 'Release updated successfully', updated: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE a release by ID
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM releases WHERE release_id = $1 RETURNING *;', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Release not found' });
    res.json({ message: 'Release deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
