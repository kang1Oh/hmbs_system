// routes/approvals_routes.js
const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// CRUD operations for approvals
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM approvals ORDER BY approval_id ASC;');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { request_id, user_id, name, role_id, status_id, remarks } = req.body;
    const result = await pool.query(
      `INSERT INTO approvals 
        (request_id, user_id, name, role_id, status_id, remarks, date_approved)
       VALUES ($1,$2,$3,$4,$5,$6, NOW())
       RETURNING *;`,
      [request_id, user_id, name, role_id, status_id, remarks]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM approvals WHERE approval_id = $1;', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Approval not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const fields = [
      'request_id',
      'user_id',
      'name',
      'role_id',
      'status_id',
      'remarks',
      'date_approved'
    ];

    const updates = [];
    const values = [];
    let idx = 1;

    for (const f of fields) {
      if (req.body[f] !== undefined) {
        updates.push(`${f} = $${idx}`);
        values.push(req.body[f]);
        idx++;
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    values.push(req.params.id);
    const query = `UPDATE approvals SET ${updates.join(', ')} WHERE approval_id = $${idx} RETURNING *;`;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Approval not found' });

    res.json({ message: 'Approval updated successfully', updated: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM approvals WHERE approval_id = $1 RETURNING *;', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Approval not found' });
    res.json({ message: 'Approval deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
