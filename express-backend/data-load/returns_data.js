// seeder: returns_data.js
const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const { Parser } = require('json2csv');

const CSV_FILE = '../../csv_files/returns.csv';
const BASE_URL = 'http://localhost:5000/api/returns';

// 📥 Reads returns from CSV
function readReturnsFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const returns = [];

    fs.createReadStream(filePath)
      .pipe(
        csv({
          mapHeaders: ({ header }) => header.trim().replace(/^"+|"+$/g, ''),
        })
      )
      .on('data', (row) => {
        console.log('🧾 Raw Row:', row);

        const request_id = row['request_id']?.trim();
        const tool_id = row['tool_id']?.trim();
        const quantity = row['quantity']?.trim();
        const status = row['status']?.trim();
        const remarks = row['remarks']?.trim();
        const returned_by = row['returned_by']?.trim();
        const return_date = row['return_date']?.trim();
        const nedb_id = row['nedb_id']?.trim();

        if (request_id && tool_id && quantity && status && returned_by && return_date) {
          const parsed = {
            request_id: (request_id),
            tool_id: (tool_id),
            quantity: Number(quantity),
            status,
            remarks,
            returned_by,
            return_date,
            _id: nedb_id || undefined,
          };
          console.log('✅ Parsed Return:', parsed);
          returns.push(parsed);
        } else {
          console.warn('⚠️ Skipping row due to missing fields:', row);
        }
      })
      .on('end', () => resolve(returns))
      .on('error', reject);
  });
}

// 📝 Write returns back to CSV
async function exportReturnsToCSV() {
  try {
    const response = await axios.get(BASE_URL);
    const returns = response.data;

    const fields = [
      'request_id',
      'tool_id',
      'quantity',
      'status',
      'remarks',
      'returned_by',
      'return_date',
      'nedb_id',
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(
      returns.map((r) => ({
        request_id: r.request_id,
        tool_id: r.tool_id,
        quantity: r.quantity,
        status: r.status,
        remarks: r.remarks,
        returned_by: r.returned_by,
        return_date: r.return_date,
        nedb_id: r._id || '',
      }))
    );

    fs.writeFileSync(CSV_FILE, csv);
    console.log(`💾 Returns exported to ${CSV_FILE}`);
  } catch (err) {
    console.error('❌ CSV export error:', err.message);
  }
}

// 🚀 Load returns into the API
async function testReturnsAPI() {
  try {
    const returns = await readReturnsFromCSV(CSV_FILE);
    console.log(`📄 Loaded ${returns.length} returns from CSV.`);

    for (const ret of returns) {
      try {
        const response = await axios.post(BASE_URL, ret);
        console.log(`✅ Created return: ${ret._id}`);
        console.log('📦 Response:', response.data);
      } catch (err) {
        if (err.response) {
          console.error(`❌ Failed to create return "${ret._id}":`, err.response.data);
        } else {
          console.error(`❌ Error posting return "${ret._id}":`, err.message);
        }
      }
    }

    // 🧾 Fetch all returns
    const getAll = await axios.get(BASE_URL);
    console.log(`📋 Total returns in DB: ${getAll.data.length}`);
    console.log('📂 Returns:', getAll.data);

    // ✅ Export snapshot
    await exportReturnsToCSV(getAll.data);
  } catch (err) {
    console.error('❌ CSV or API error:', err.message);
  }
}

module.exports = { testReturnsAPI, exportReturnsToCSV };
