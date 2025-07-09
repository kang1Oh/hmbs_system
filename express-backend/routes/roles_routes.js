const express = require('express');
const router = express.Router();
const { roles } = require('../models/db');

// GET all roles
router.get('/', (req, res) => {
  roles.find({}, (err, docs) => {
    if (err) return res.status(500).json({ error: err.message || err });
    res.json(docs);
  });
});

// GET role by ID
router.get('/:id', (req, res) => {
  roles.findOne({ _id: req.params.id }, (err, doc) => {
    if (err) return res.status(500).json({ error: err.message || err });
    if (!doc) return res.status(404).json({ message: 'Role not found' });
    res.json(doc);
  });
});

// CREATE a new role
router.post('/', (req, res) => {
  const newRole = {
    name: req.body.name,
  };

  roles.insert(newRole, (err, newDoc) => {
    if (err) return res.status(500).json({ error: err.message || err });
    res.status(201).json(newDoc);
  });
});

// UPDATE a role by ID
router.put('/:id', (req, res) => {
  const updates = {
    name: req.body.name,
    description: req.body.description
  };

  roles.update({ _id: req.params.id }, { $set: updates }, {}, (err, numReplaced) => {
    if (err) return res.status(500).json({ error: err.message || err });
    if (numReplaced === 0) return res.status(404).json({ message: 'Role not found' });
    res.json({ message: 'Role updated successfully' });
  });
});

// DELETE a role by ID
router.delete('/:id', (req, res) => {
  roles.remove({ _id: req.params.id }, {}, (err, numRemoved) => {
    if (err) return res.status(500).json({ error: err.message || err });
    if (numRemoved === 0) return res.status(404).json({ message: 'Role not found' });
    res.json({ message: 'Role deleted successfully' });
  });
});

module.exports = router;
