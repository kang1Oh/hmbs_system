const express = require('express');
const router = express.Router();
const { users } = require('../models/db');
const CryptoJS = require('crypto-js');
const { SECRET_KEY } = require('../config');

// 🔐 Decryption helper
function decryptId(encryptedId) {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedId, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return null;
  }
}

// 🔐 Encryption helper (used when returning user data)
function encryptId(id) {
  return CryptoJS.AES.encrypt(id, SECRET_KEY).toString();
}

// 🔹 GET all users
router.get('/', (req, res) => {
  users.find({}, (err, docs) => {
    if (err) return res.status(500).json({ error: err });

    // Encrypt user IDs in response
    const result = docs.map((user) => ({
      ...user,
      encryptedId: encryptId(user._id),
      _id: undefined // optional: remove plain _id
    }));

    res.json(result);
  });
});

// 🔹 GET a user by encrypted ID
router.get('/:encryptedId', (req, res) => {
  const decryptedId = decryptId(req.params.encryptedId);
  if (!decryptedId) return res.status(400).json({ error: 'Invalid ID' });

  users.findOne({ _id: decryptedId }, (err, doc) => {
    if (err) return res.status(500).json({ error: err });
    if (!doc) return res.status(404).json({ message: 'User not found' });

    // Add encrypted ID in response
    res.json({ ...doc, encryptedId: req.params.encryptedId, _id: undefined });
  });
});

// 🔹 POST a new user
router.post('/', (req, res) => {
  const newUser = {
    ...req.body,
    active: true,
    createdAt: new Date()
  };

  users.insert(newUser, (err, newDoc) => {
    if (err) return res.status(500).json({ error: err });

    res.status(201).json({
      ...newDoc,
      encryptedId: encryptId(newDoc._id),
      _id: undefined
    });
  });
});

// 🔹 PUT (Update) user by encrypted ID
router.put('/:encryptedId', (req, res) => {
  const decryptedId = decryptId(req.params.encryptedId);
  if (!decryptedId) return res.status(400).json({ error: 'Invalid ID' });

  users.update({ _id: decryptedId }, { $set: req.body }, {}, (err, numReplaced) => {
    if (err) return res.status(500).json({ error: err });
    if (numReplaced === 0) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User updated' });
  });
});

// 🔹 DELETE (Soft-delete) user by encrypted ID
router.delete('/:encryptedId', (req, res) => {
  const decryptedId = decryptId(req.params.encryptedId);
  if (!decryptedId) return res.status(400).json({ error: 'Invalid ID' });

  users.update({ _id: decryptedId }, { $set: { active: false } }, {}, (err, numAffected) => {
    if (err) return res.status(500).json({ error: err });
    if (numAffected === 0) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User account deactivated' });
  });
});

module.exports = router;
