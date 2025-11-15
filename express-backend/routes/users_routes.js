const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const csv = require('csv-parser');
const { Parser } = require('json2csv');
const uploadMiddleware = multer({ dest: 'uploads/' });
const pool = require('../models/db');

// 🔒 Auth middleware
function requireAuth(req, res, next) {
  if (!req.session || !req.session.user)
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  next();
}

// 🧾 EXPORT users to CSV
router.get('/export', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users ORDER BY user_id ASC');

    const fields = [
      'user_id',
      'role_id',
      'email',
      'password',
      'name',
      'active',
      'created_at'
    ];
    const parser = new Parser({ fields });
    const csvData = parser.parse(rows);

    const exportPath = path.join(__dirname, '..', 'csv_exports', 'users.csv');
    fs.writeFileSync(exportPath, csvData);

    res.header('Content-Type', 'text/csv');
    res.attachment('users.csv');
    res.send(csvData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ IMPORT users from CSV
router.post('/import', uploadMiddleware.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const requiredHeaders = ['role_id', 'email', 'password', 'name', 'active'];
  const results = [];
  let headersValidated = false;

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('headers', (headers) => {
      const normalized = headers.map((h) => h.trim().toLowerCase());
      const missing = requiredHeaders.filter(
        (h) => !normalized.includes(h.toLowerCase())
      );
      if (missing.length > 0) {
        fs.unlinkSync(req.file.path);
        res
          .status(400)
          .json({ message: `Missing required columns: ${missing.join(', ')}` });
      } else {
        headersValidated = true;
      }
    })
    .on('data', (row) => {
      if (headersValidated) {
        results.push({
          role_id: Number(row.role_id),
          email: row.email?.trim().toLowerCase(),
          password: row.password,
          name: row.name,
          active:
            row.active &&
            (row.active.toString().toLowerCase() === 'true' ||
              row.active.toString() === '1'),
        });
      }
    })
    .on('end', async () => {
      fs.unlinkSync(req.file.path);
      if (results.length === 0)
        return res
          .status(400)
          .json({ message: 'CSV file contained no valid rows' });

      try {
        const inserted = [];
        for (const user of results) {
          // Check for duplicate emails before inserting
          const existing = await pool.query(
            'SELECT user_id FROM users WHERE email = $1',
            [user.email]
          );
          if (existing.rows.length > 0) continue;

          const query = `
            INSERT INTO users (role_id, email, password, name, active)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
          `;
          const values = [
            user.role_id,
            user.email,
            user.password,
            user.name,
            user.active,
          ];
          const { rows } = await pool.query(query, values);
          inserted.push(rows[0]);
        }

        if (inserted.length === 0)
          return res.json({
            message: 'No new users imported (all duplicates)',
            users: [],
          });

        res.json({
          message: `Imported ${inserted.length} users successfully`,
          users: inserted,
        });
      } catch (err) {
        console.error('User import error:', err);
        res.status(500).json({ error: err.message });
      }
    });
});

// 👥 GET all users (hide password)
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT user_id, role_id, email, name, active, created_at FROM users WHERE active = TRUE ORDER BY user_id ASC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👥 GET all users (with passwords)
router.get('/with-passwords', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔍 SEARCH by role + name
router.get('/search/:role/:name', async (req, res) => {
  const { role, name } = req.params;

  try {
    // If searching for students (role 4), exclude students with ongoing requests
    if (Number(role) === 4) {
      const query = `
        SELECT u.user_id, u.name, u.email
        FROM users u
        WHERE u.role_id = 4
          AND u.active = TRUE
          AND u.name ILIKE $1
          AND u.user_id NOT IN (
            SELECT g.user_id
            FROM groups g
            JOIN borrow_requests br ON br.request_id = g.request_id
            WHERE br.status_id IN (1,2,3,4)
          )
      `;
      const { rows } = await pool.query(query, [`%${name}%`]);
      return res.json(rows);
    }

    // Otherwise, normal search for instructors
    const { rows } = await pool.query(
      `
        SELECT user_id, name, email
        FROM users
        WHERE role_id = $1
          AND active = TRUE
          AND name ILIKE $2
      `,
      [role, `%${name}%`]
    );
    res.json(rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//Create User
router.post('/', async (req, res) => {
  const { role_id, email, password, name } = req.body;
  try {
    const existing = await pool.query('SELECT 1 FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const { rows } = await pool.query(
      'INSERT INTO users (role_id, email, password, name, active) VALUES ($1, $2, $3, $4, TRUE) RETURNING user_id, role_id, email, name, active, created_at',
      [role_id, email, password, name]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Add user error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) return res.status(400).json({ error: 'Email required' });

    const q = 'SELECT active FROM users WHERE email = $1 LIMIT 1';
    const { rows } = await pool.query(q, [email.trim().toLowerCase()]);
    if (rows.length === 0) return res.json({ exists: false, active: null });

    // If a row exists, return exists true and its active flag
    return res.json({ exists: true, active: rows[0].active });
  } catch (err) {
    console.error('check-email error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// 🔐 LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];
    if (!user || user.password !== password)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    req.session.user = {
      user_id: user.user_id,
      email: user.email,
      role_id: String(user.role_id),
      name: user.name,
    };

    res.json({ success: true, message: 'Login successful', user: req.session.user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🧾 SESSION
router.get('/session', (req, res) => {
  if (req.session && req.session.user)
    return res.json({ authenticated: true, user: req.session.user });
  res.status(401).json({ authenticated: false });
});

// 🚪 LOGOUT
router.post('/logout', (req, res) => {
  if (!req.session) return res.json({ success: true });
  req.session.destroy((err) => {
    res.clearCookie('hmbs.sid');
    if (err) return res.status(500).json({ success: false, message: 'Logout failed' });
    res.json({ success: true });
  });
});

// 🧍‍♂️ GET by ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const { rows } = await pool.query(
      'SELECT user_id, role_id, email, name, active, created_at FROM users WHERE user_id = $1',
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ UPDATE user
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { name, email, role_id, active } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2, role_id = $3, active = $4 WHERE user_id = $5',
      [name, email, role_id, active, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🗑️ DEACTIVATE user (soft delete)
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      'UPDATE users SET active = FALSE WHERE user_id = $1',
      [id]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User account deactivated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
