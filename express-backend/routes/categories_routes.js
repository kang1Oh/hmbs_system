// routes/categories_routes.js
const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// ✅ GET all categories (deduplicated by category_id)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT category_id, category_name FROM categories ORDER BY category_name ASC;');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST create new category
router.post('/', async (req, res) => {
  try {
    const { category_name } = req.body;

    if (!category_name) {
      return res.status(400).json({ error: 'Missing required field: category_name' });
    }

    const result = await pool.query(
      `INSERT INTO categories (category_name)
       VALUES ($1)
       RETURNING *;`,
      [category_name]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET category by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories WHERE category_id = $1;', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Category not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE category by ID
router.put('/:id', async (req, res) => {
  try {
    const { category_name } = req.body;

    if (!category_name) {
      return res.status(400).json({ error: 'Missing required field: category_name' });
    }

    const result = await pool.query(
      `UPDATE categories
       SET category_name = $1
       WHERE category_id = $2
       RETURNING *;`,
      [category_name, req.params.id]
    );

    if (result.rowCount === 0) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category updated successfully', updated: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE category by ID
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM categories WHERE category_id = $1 RETURNING *;', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
