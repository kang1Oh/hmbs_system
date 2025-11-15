// routes/groups_routes.js
const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// ✅ GET all groups
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM groups ORDER BY group_id ASC;');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET all group members for a given request_id
router.get('/request/:requestId', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM groups WHERE request_id = $1 ORDER BY group_id ASC;', [req.params.requestId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST create a new group entry
router.post('/', async (req, res) => {
  try {
    const { request_id, user_id, is_leader } = req.body;

    const result = await pool.query(
      `INSERT INTO groups (request_id, user_id, is_leader)
       VALUES ($1, $2, $3)
       RETURNING *;`,
      [request_id, user_id, is_leader ?? false]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET group by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM groups WHERE group_id = $1;', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Group not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE group by ID
router.put('/:id', async (req, res) => {
  try {
    const { request_id, user_id, is_leader} = req.body;

    const result = await pool.query(
      `UPDATE groups
       SET request_id = $1,
           user_id = $2,
           is_leader = $3
       WHERE group_id = $4
       RETURNING *;`,
      [request_id, user_id, is_leader ?? false, req.params.id]
    );

    if (result.rowCount === 0) return res.status(404).json({ message: 'Group not found' });
    res.json({ message: 'Group updated successfully', updated: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE group by ID
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM groups WHERE group_id = $1 RETURNING *;', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Group not found' });
    res.json({ message: 'Group deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
