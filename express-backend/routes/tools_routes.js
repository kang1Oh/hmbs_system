const express = require('express');
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv'); 
const router = express.Router();
const { tools } = require('../models/db');
const upload = require('../middleware/upload');
const csv = require('csv-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });

// 📤 EXPORT current DB to CSV into /csv_exports folder
router.get('/export', (req, res) => {
  tools.find({}).sort({ tool_id: 1 }).exec((err, docs) => {
    if (err) return res.status(500).json({ error: err });

    const fields = [
      'tool_id',
      'category_id',
      'name',
      'location',
      'available_qty',
      'unit',
      'price',
      'img',
      'tool_status',
      'disposal_status',
      '_id'
    ];
    const parser = new Parser({ fields });
    const csv = parser.parse(docs);

    // write to /csv_exports/tools.csv instead of seeder folder
    const csvPath = path.join(__dirname, '..', 'csv_exports', 'tools.csv');
    try {
      fs.writeFileSync(csvPath, csv);
    } catch (e) {
      console.error('⚠️ Failed to write export CSV:', e.message);
    }

    res.header('Content-Type', 'text/csv');
    res.attachment('tools.csv');
    res.send(csv);
  });
});

// 📥 IMPORT tools from uploaded CSV file (with header validation)
router.post("/import", uploadMiddleware.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const requiredHeaders = [
    "category_id",
    "name",
    "location",
    "available_qty",
    "unit",
    "price",
    "img",
    "tool_status",
    "disposal_status",
  ];

  const results = [];
  let headersValidated = false;

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("headers", (headers) => {
      // Normalize headers (trim + lowercase)
      const normalized = headers.map((h) => h.trim().toLowerCase());
      const missing = requiredHeaders.filter(
        (h) => !normalized.includes(h.toLowerCase())
      );

      if (missing.length > 0) {
        fs.unlinkSync(req.file.path); // cleanup temp file
        return res
          .status(400)
          .json({ message: `Missing required columns: ${missing.join(", ")}` });
      }

      headersValidated = true;
    })
    .on("data", (row) => {
      if (headersValidated) {
        results.push({
          category_id: Number(row.category_id),
          name: row.name,
          location: row.location,
          available_qty: Number(row.available_qty),
          unit: row.unit,
          price: Number(row.price),
          img:
            row.img && row.img.trim() !== ""
              ? row.img
              : "/uploads/tools/default.png",
          tool_status: row.tool_status || "Available",
          disposal_status: row.disposal_status || "Good Condition",
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

      tools.find({}).exec((err, docs) => {
        if (err) return res.status(500).json({ error: err });

          // parse all tool_id to numbers
          const maxId = docs.reduce((max, d) => {
            const id = parseInt(d.tool_id, 10);
            return id > max ? id : max;
          }, 0);

          let nextId = maxId + 1;

          const toolsWithIds = results.map((tool, idx) => ({
            ...tool,
            tool_id: nextId + idx,
            createdAt: new Date(),
          }));

          tools.insert(toolsWithIds, (err, newDocs) => {
            fs.unlinkSync(req.file.path); // cleanup

            if (err) return res.status(500).json({ error: err });
            res.json({
              message: `Imported ${newDocs.length} tools successfully`,
              tools: newDocs,
            });
          });
        });
    });
});


// ✅ GET all tools
router.get('/', (req, res) => {
  tools.find({}, (err, docs) => {
    if (err) return res.status(500).json({ error: err });
    res.json(docs);
  });
});

// ✅ GET tool by numeric tool_id
router.get('/numeric/:tool_id', (req, res) => {
  tools.findOne({ tool_id: req.params.tool_id }, (err, doc) => {
    if (err) return res.status(500).json({ error: err });
    if (!doc) return res.status(404).json({ message: 'Tool not found' });
    res.json(doc);
  });
});

// ✅ GET tool by NeDB _id
router.get('/:id', (req, res) => {
  tools.findOne({ _id: req.params.id }, (err, doc) => {
    if (err) return res.status(500).json({ error: err });
    if (!doc) return res.status(404).json({ message: 'Tool not found' });
    res.json(doc);
  });
});

// ✅ CREATE tool
router.post('/', upload.single('image'), (req, res) => {
  const { tool_id } = req.body;

  if (!tool_id) {
    return res.status(400).json({ error: 'tool_id is required' });
  }

  tools.findOne({ tool_id: tool_id.toString().trim() }, (err, existingTool) => {
    if (err) return res.status(500).json({ error: err });
    if (existingTool) {
      return res.status(400).json({ error: 'Tool with this ID already exists' });
    }

    const imgPath = req.file ? `/uploads/tools/${req.file.filename}` : "/uploads/tools/default.png";

    const newTool = {
      ...req.body,
      tool_id: tool_id.toString().trim(),
      img: imgPath,
      createdAt: new Date()
    };

    tools.insert(newTool, (err, newDoc) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json(newDoc);
    });
  });
});


// ✅ UPDATE tool (by _id)
router.put('/:id', upload.single('image'), (req, res) => {
  const updateData = { ...req.body };

  // If a new image was uploaded, update the `img` field
  if (req.file) {
    updateData.img = `/uploads/tools/${req.file.filename}`;

    // Optionally, delete the old image file from the server
    tools.findOne({ _id: req.params.id }, (err, existingTool) => {
      if (err) return;
      if (existingTool && existingTool.img) {
        const oldImagePath = path.join(__dirname, '..', 'public', existingTool.img);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('⚠️ Failed to delete old image:', err.message);
        });
      }
    });
  }

  tools.update(
    { _id: req.params.id },
    { $set: updateData },
    {},
    (err, numUpdated) => {
      if (err) return res.status(500).json({ error: err });
      if (numUpdated === 0) {
        return res.status(404).json({ message: 'Tool not found' });
      }
      res.json({ message: 'Tool updated successfully' });
    }
  );
});


// ✅ DELETE tool (by _id)
router.delete('/:id', (req, res) => {
  tools.remove({ _id: req.params.id }, {}, (err, numRemoved) => {
    if (err) return res.status(500).json({ error: err });
    if (numRemoved === 0) return res.status(404).json({ message: 'Tool not found' });
    res.json({ message: 'Tool deleted successfully' });

    // Optionally, delete the associated image file from the server
    tools.findOne({ _id: req.params.id }, (err, existingTool) => {
      if (err) return;
      if (existingTool && existingTool.img) {
        const imagePath = path.join(__dirname, '..', 'public', existingTool.img);
        fs.unlink(imagePath, (err) => {
          if (err) console.error('⚠️ Failed to delete image:', err.message);
        });
      }
    });
  });
});


module.exports = router;
