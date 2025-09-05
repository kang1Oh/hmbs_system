const express = require('express');
const router = express.Router();
const { users } = require('../models/db');

// 🔹 RequireAuth to protect routes
function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
}

// 🔹 GET all users
router.get('/', (req, res) => {
  users.find({}, (err, docs) => {
    if (err) return res.status(500).json({ error: err });

    // Hide nothing except password
    const result = docs.map(({ password, ...rest }) => rest);
    res.json(result);
  });
});

// 🔹 GET a user by ID (plain ID, no encryption)
router.get('/:id', (req, res) => {
  users.findOne({ _id: req.params.id }, (err, doc) => {
    if (err) return res.status(500).json({ error: err });
    if (!doc) return res.status(404).json({ message: 'User not found' });

    const { password, ...safeDoc } = doc;
    res.json(safeDoc);
  });
});

// 🔹 POST a new user (plain password)
router.post('/', (req, res) => {
  const newUser = {
    ...req.body,
    active: true,
    createdAt: new Date()
  };

  users.insert(newUser, (err, newDoc) => {
    if (err) return res.status(500).json({ error: err });

    const { password, ...safeDoc } = newDoc;
    res.status(201).json(safeDoc);
  });
});

// 🔹 PUT (Update) user by ID
router.put('/:id', (req, res) => {
  users.update({ _id: req.params.id }, { $set: req.body }, {}, (err, numReplaced) => {
    if (err) return res.status(500).json({ error: err });
    if (numReplaced === 0) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User updated' });
  });
});

// 🔹 DELETE (Soft-delete) user by ID
router.delete('/:id', (req, res) => {
  users.update({ _id: req.params.id }, { $set: { active: false } }, {}, (err, numAffected) => {
    if (err) return res.status(500).json({ error: err });
    if (numAffected === 0) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User account deactivated' });
  });
});

// 🔹 POST login — sets session
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  users.findOne({ email }, (err, user) => {
    if (err) return res.status(500).json({ success: false, message: 'Server error' });
    if (!user) return res.status(401).json({ success: false, message: '201: Invalid credentials' });

    if (user.password !== password) {
      return res.status(401).json({ success: false, message: '202: Invalid credentials' });
    }

    // Save user info in session
    req.session.user = {
      _id: user._id,
      user_id: user.user_id,
      email: user.email,
      role_id: String(user.role_id), // normalize to string
      name: user.name,
    };

    res.json({
      success: true,
      message: 'Login successful',
      user: req.session.user, // echo back stored data
    });
  });
});

// 🔹 GET /session — check current session
router.get('/session', (req, res) => {
  if (req.session && req.session.user) {
    return res.json({ authenticated: true, user: req.session.user });
  }
  res.status(401).json({ authenticated: false });
});

// 🔹 POST /logout — destroy session and clear cookie
router.post('/logout', (req, res) => {
  if (!req.session) return res.json({ success: true });
  req.session.destroy((err) => {
    // clear cookie either way
    res.clearCookie('hmbs.sid');
    if (err) return res.status(500).json({ success: false, message: 'Logout failed' });
    res.json({ success: true });
  });
});

router.get('/search/:name', (req, res) => {
  const regex = new RegExp(req.params.name, 'i');

  users.find({ name: regex, role_id: '4' }, (err, docs) => {
    if (err) return res.status(500).json({ error: err });

    if (!docs || docs.length === 0) {
      return res.json([]); // empty array
    }

    // Deduplicate by email
    const unique = {};
    docs.forEach(u => {
      unique[u.email] = { _id: u._id, name: u.name, email: u.email };
    });

    res.json(Object.values(unique));
  });
});




module.exports = router;
