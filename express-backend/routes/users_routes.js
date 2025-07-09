const express = require('express');
const router = express.Router();
const { users } = require('../models/db');
const CryptoJS = require('crypto-js');
const bcrypt = require('bcrypt');
const { SECRET_KEY } = require('../config');

const SALT_ROUNDS = 10;

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

    const result = docs.map((user) => {
      const { _id, password, ...rest } = user;
      return {
        ...rest,
        encryptedId: encryptId(_id),
      };
    });

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

    const { password, ...safeDoc } = doc;
    res.json({ ...safeDoc, encryptedId: req.params.encryptedId });
  });
});

// 🔹 POST a new user (with hashed password)
router.post('/', async (req, res) => {
  try {
    const { password, ...otherFields } = req.body;

    if (!password) return res.status(400).json({ error: 'Password is required' });

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = {
      ...otherFields,
      password: hashedPassword,
      active: true,
      createdAt: new Date()
    };

    users.insert(newUser, (err, newDoc) => {
      if (err) return res.status(500).json({ error: err });

      const { password, _id, ...safeDoc } = newDoc;
      res.status(201).json({
        ...safeDoc,
        encryptedId: encryptId(_id)
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
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
