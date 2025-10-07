const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const { users, groups, borrowRequests } = require('../models/db');
const upload = require('../middleware/upload');
const csv = require('csv-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });

// 📤 EXPORT current DB to CSV into /csv_exports
router.get('/export', requireAuth, (req, res) => {
  users.find({}).sort({ user_id: 1 }).exec((err, docs) => {
    if (err) return res.status(500).json({ error: err });

    // match seeder columns
    const fields = [
      'user_id',
      'role_id',
      'email',
      'password',
      'name',
      'active',
      'createdAt',
      '_id'
    ];
    const parser = new Parser({ fields });
    const csv = parser.parse(docs);

    const csvPath = path.join(__dirname, '..', 'csv_exports', 'users.csv');
    try {
      fs.writeFileSync(csvPath, csv);
    } catch (e) {
      console.error('⚠️ Failed to write export CSV:', e.message);
    }

    res.header('Content-Type', 'text/csv');
    res.attachment('users.csv');
    res.send(csv);
  });
});

const validRoles = [1, 2, 3, 4];

// 📥 IMPORT users from uploaded CSV file (with header validation)
router.post("/import", uploadMiddleware.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const requiredHeaders = ["name", "email", "password", "role_id"];
  const results = [];
  let headersValidated = false;

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("headers", (headers) => {
      const normalized = headers.map((h) => h.trim().toLowerCase());
      const missing = requiredHeaders.filter(
        (h) => !normalized.includes(h.toLowerCase())
      );

      if (missing.length > 0) {
        fs.unlinkSync(req.file.path);
        return res
          .status(400)
          .json({ message: `Missing required columns: ${missing.join(", ")}` });
      }

      headersValidated = true;
    })
    
    .on("data", (row) => {
      if (headersValidated) {
        const roleId = Number(row.role_id);
        if (!validRoles.includes(roleId)) return; // skip invalid roles

        results.push({
          name: row.name,
          email: row.email.trim().toLowerCase(), // normalize
          password: row.password,
          role_id: Number(row.role_id),
          active: true,
          createdAt: new Date(),
        });
      }
    })
    .on("end", () => {
      if (results.length === 0) {
        fs.unlinkSync(req.file.path);
        return res
          .status(400)
          .json({ message: "CSV file contained no valid rows" });
      }

      // Grab all emails first
      const emails = results.map((r) => r.email);

      users.find({ email: { $in: emails } }, (err, existing) => {
        if (err) return res.status(500).json({ error: err });

        const existingEmails = new Set(existing.map((u) => u.email));
        const filtered = results.filter((r) => !existingEmails.has(r.email));

        if (filtered.length === 0) {
          fs.unlinkSync(req.file.path);
          return res.json({ message: "No new users imported (all duplicates)" });
        }

        // get max user_id
        users.find({}).sort({ user_id: -1 }).limit(1).exec((err, docs) => {
          if (err) return res.status(500).json({ error: err });

          const maxId = (docs && docs[0] && Number(docs[0].user_id)) || 0;
          let nextId = maxId + 1;

          const usersWithIds = filtered.map((user, idx) => ({
            ...user,
            user_id: nextId + idx,
          }));

          users.insert(usersWithIds, (err, newDocs) => {
            fs.unlinkSync(req.file.path);
            if (err) return res.status(500).json({ error: err });

            const safeDocs = newDocs.map(({ password, ...rest }) => rest);
            res.json({
              message: `Imported ${newDocs.length} users (duplicates skipped)`,
              users: safeDocs,
            });
          });
        });
      });
    });
});

// auth helper
function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
}

// helper: find by numeric user_id or _id
function findUserById(id, cb) {
  if (/^\d+$/.test(String(id))) {
    users.findOne({ user_id: Number(id) }, cb);
  } else {
    users.findOne({ _id: id }, cb);
  }
}

// helper: next numeric user_id
function getNextUserId(cb) {
  users.find({}).sort({ user_id: -1 }).limit(1).exec((err, docs) => {
    if (err) return cb(err);
    const max = (docs && docs[0] && Number(docs[0].user_id)) || 0;
    cb(null, max + 1);
  });
}

// GET all users (hide password)
router.get('/', (req, res) => {
  users.find({ active: true }).sort({ user_id: 1 }).exec((err, docs) => {
    if (err) return res.status(500).json({ error: err });
    const result = docs.map(({ password, ...rest }) => rest);
    res.json(result);
  });
});

// GET all users (unsafe, includes password) – for internal seeder/export only
router.get('/with-passwords', (req, res) => {
  users.find({}, (err, docs) => {
    if (err) return res.status(500).json({ error: err });
    res.json(docs); // includes password
  });
});

// SEARCH by name + role with borrow check
router.get('/search/:role/:name', async (req, res) => {
  const { role, name } = req.params;
  const regex = new RegExp(name, 'i');

  try {
    // find users with given role and matching name
    const foundUsers = await new Promise((resolve, reject) => {
      users.find(
        { name: regex, role_id: { $in: [Number(role), role] } },
        (err, docs) => (err ? reject(err) : resolve(docs || []))
      );
    });

    if (!foundUsers.length) return res.json([]);

    // for student role only (4)
    if (Number(role) === 4 || role === '4') {
      const userIds = foundUsers.map(u => u._id);

      // find groups that include these users
      const userGroups = await new Promise((resolve, reject) => {
        groups.find({ user_id: { $in: userIds } }, (err, docs) =>
          err ? reject(err) : resolve(docs || [])
        );
      });

      if (userGroups.length) {
        const requestIds = [...new Set(userGroups.map(g => g.request_id))];

        // get statuses of related borrow requests
        const relatedRequests = await new Promise((resolve, reject) => {
          borrowRequests.find(
            { _id: { $in: requestIds } },
            (err, docs) => (err ? reject(err) : resolve(docs || []))
          );
        });

        const ongoingRequestIds = new Set(
          relatedRequests
            .filter(r => [2, 3, 4].includes(Number(r.status_id)))
            .map(r => r._id)
        );

        const invalidUserIds = new Set(
          userGroups
            .filter(g => ongoingRequestIds.has(g.request_id))
            .map(g => g.user_id)
        );

        // filter out students in ongoing requests
        const filtered = foundUsers.filter(u => !invalidUserIds.has(u._id));

        const unique = {};
        filtered.forEach(u => {
          unique[u.email] = {
            _id: u._id,
            user_id: u.user_id,
            name: u.name,
            email: u.email,
          };
        });
        return res.json(Object.values(unique));
      }
    }

    // for non-students or if no group
    const unique = {};
    foundUsers.forEach(u => {
      unique[u.email] = {
        _id: u._id,
        user_id: u.user_id,
        name: u.name,
        email: u.email,
      };
    });
    res.json(Object.values(unique));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create user. Assign numeric user_id if absent.
router.post('/', (req, res) => {
  const body = { ...req.body };
  body.role_id = body.role_id !== undefined ? Number(body.role_id) : undefined;
  body.active = true;
  body.createdAt = new Date();

  const finishInsert = (docToInsert) => {
    users.insert(docToInsert, (err, newDoc) => {
      if (err) return res.status(500).json({ error: err });
      const { password, ...safeDoc } = newDoc;
      res.status(201).json(safeDoc);
    });
  };

  if (body.user_id === undefined || body.user_id === '' || body.user_id === null) {
    getNextUserId((err, nextId) => {
      if (err) return res.status(500).json({ error: err });
      body.user_id = nextId;
      finishInsert(body);
    });
  } else {
    body.user_id = Number(body.user_id);
    finishInsert(body);
  }
});

// POST login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  users.findOne({ email }, (err, user) => {
    if (err) return res.status(500).json({ success: false, message: 'Server error' });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    if (user.password !== password) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    req.session.user = {
      _id: user._id,
      user_id: user.user_id,
      email: user.email,
      role_id: String(user.role_id),
      name: user.name,
    };

    res.json({ success: true, message: 'Login successful', user: req.session.user });
  });
});

// GET /session
router.get('/session', (req, res) => {
  if (req.session && req.session.user) return res.json({ authenticated: true, user: req.session.user });
  res.status(401).json({ authenticated: false });
});

// POST /logout
router.post('/logout', (req, res) => {
  if (!req.session) return res.json({ success: true });
  req.session.destroy((err) => {
    res.clearCookie('hmbs.sid');
    if (err) return res.status(500).json({ success: false, message: 'Logout failed' });
    res.json({ success: true });
  });
});

// GET a user by numeric user_id or _id
router.get('/:id', (req, res) => {
  findUserById(req.params.id, (err, doc) => {
    if (err) return res.status(500).json({ error: err });
    if (!doc) return res.status(404).json({ message: 'User not found' });
    const { password, ...safeDoc } = doc;
    res.json(safeDoc);
  });
});

// PUT update by numeric user_id or _id
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const selector = /^\d+$/.test(String(id)) ? { user_id: Number(id) } : { _id: id };

  // Prevent accidental _id overwrite
  if (req.body._id) delete req.body._id;

  users.update(selector, { $set: req.body }, {}, (err, numReplaced) => {
    if (err) return res.status(500).json({ error: err }); 
    if (numReplaced === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated' });
  });
});

// DELETE (soft) by numeric user_id or _id
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const selector = /^\d+$/.test(String(id)) ? { user_id: Number(id) } : { _id: id };

  users.update(selector, { $set: { active: false } }, {}, (err, numAffected) => {
    if (err) return res.status(500).json({ error: err });
    if (numAffected === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User account deactivated' });
  });
});

module.exports = router;
