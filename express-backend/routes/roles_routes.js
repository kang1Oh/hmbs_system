// routes/roles_routes.js
const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// GET all roles
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT role_id AS id, role_name AS name FROM roles ORDER BY role_id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE a new role
router.post('/', async (req, res) => {
  const { id, name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Role name is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO roles (role_name) VALUES ($1) RETURNING role_id AS id, role_name AS name',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET role by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT role_id AS id, role_name AS name FROM roles WHERE role_id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Role not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a role by ID
router.put('/:id', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      'UPDATE roles SET role_name = $1 WHERE role_id = $2 RETURNING *',
      [name, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Role not found' });
    res.json({ message: 'Role updated successfully', updated: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a role by ID
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM roles WHERE role_id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Role not found' });
    res.json({ message: 'Role deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
