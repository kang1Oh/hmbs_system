// tools_data.js
const fs = require('fs');
const csv = require('csv-parser');
const { parse } = require('json2csv');
const axios = require('axios');

const CSV_FILE = '../../csv_files/tools.csv';
const BASE_URL = 'http://localhost:5000/api/tools';

// 🧠 Read tools from CSV
function readToolsFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const tools = [];

    fs.createReadStream(filePath)
      .pipe(csv({
        mapHeaders: ({ header }) => header.replace(/^"+|"+$/g, '').trim()
      }))
      .on('data', (row) => {
        const tool_id = row.tool_id?.trim();
        const category_id = row.category_id?.trim();
        const name = row.name?.trim();
        const available_qty = row.available_qty?.trim();
        const unit = row.unit?.trim();
        const price = row.price?.trim();
        const img = row.img?.trim() || '';
        const quantity = row.quantity?.trim();
        const disposal_status = row.disposal_status?.trim();
        const _id = row._id?.trim() || undefined;

        if (tool_id && category_id && name && available_qty && unit && quantity) {
          const parsedTool = {
            tool_id: Number(tool_id),
            category_id: Number(category_id),
            name,
            available_qty: parseInt(available_qty),
            unit,
            price: price ? parseFloat(price) : null,
            img,
            quantity: parseInt(quantity),
            disposal_status,
          };

          if (_id) parsedTool._id = _id; // preserve NeDB _id if present

          tools.push(parsedTool);
        } else {
          console.warn('⚠️ Skipping row due to missing required fields:', row);
        }
      })
      .on('end', () => resolve(tools))
      .on('error', reject);
  });
}

// 🚀 Seed tools into DB
async function seedTools() {
  try {
    const tools = await readToolsFromCSV(CSV_FILE);
    console.log(`📄 Loaded ${tools.length} tools from CSV.`);

    for (const tool of tools) {
      try {
        const response = await axios.post(BASE_URL, tool);
        console.log(`✅ Created tool: ${tool.name}`);
      } catch (err) {
        if (err.response) {
          console.error(`❌ Failed to create "${tool.name}":`, err.response.data);
        } else {
          console.error(`❌ Error posting "${tool.name}":`, err.message);
        }
      }
    }

    const getAll = await axios.get(BASE_URL);
    console.log(`📋 Total tools in DB: ${getAll.data.length}`);
  } catch (err) {
    console.error('❌ CSV or API error:', err.message);
  }
}

// 📤 Export DB state to CSV
async function exportToolsToCSV() {
  try {
    const response = await axios.get(BASE_URL);
    const tools = response.data;

    tools.sort((a, b) => Number(a.tool_id) - Number(b.tool_id));
    
    const fields = [
      'tool_id',
      'category_id',
      'name',
      'available_qty',
      'unit',
      'price',
      'img',
      'quantity',
      'disposal_status',
      '_id', // append NeDB-generated ID at the end
    ];

    const csv = parse(tools, { fields });
    fs.writeFileSync(CSV_FILE, csv);
    console.log(`📤 Overwrote ${CSV_FILE} with ${tools.length} tools (including _id).`);
  } catch (err) {
    console.error('❌ Error exporting tools to CSV:', err.message);
  }
}

module.exports = { seedTools, exportToolsToCSV };
