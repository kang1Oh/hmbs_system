// seeder: approvals_data.js
const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const { Parser } = require('json2csv');

const CSV_FILE = '../../csv_files/approvals.csv';
const BASE_URL = 'http://localhost:5000/api/approvals';

// 📥 Read approvals from CSV
function readApprovalsFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const approvals = [];

    fs.createReadStream(filePath)
      .pipe(
        csv({
          mapHeaders: ({ header }) => header.trim().replace(/^"+|"+$/g, ''), // Clean headers
        })
      )
      .on('data', (row) => {
        console.log('🧾 Raw Row:', row);

        const request_id = row['request_id']?.trim();
        const user_id = row['user_id']?.trim();
        const name = row['name']?.trim(); 
        const role_id = row['role_id']?.trim(); 
        const status_id = row['status_id']?.trim();
        const remarks = row['remarks']?.trim() || '';
        const date_approved = row['date_approved']?.trim() || '';
        const nedb_id = row['nedb_id']?.trim() || '';

        if (request_id && user_id && status_id) {
          const parsed = {
            request_id,
            user_id,
            name,
            role_id,
            status_id: Number(status_id),
            remarks,
            date_approved,
            _id: nedb_id || undefined, // keep nedb_id if exists
          };
          console.log('✅ Parsed Approval:', parsed);
          approvals.push(parsed);
        } else {
          console.warn('⚠️ Skipping row due to missing required fields:', row);
        }
      })
      .on('end', () => resolve(approvals))
      .on('error', reject);
  });
}

// 📝 Write approvals (with NeDB _id) back to CSV
async function exportApprovalsToCSV() {
  try {
    const response = await axios.get(BASE_URL);
    const approvals = response.data;

    const fields = [
      'request_id',
      'user_id',
      'name',
      'role_id',
      'status_id',
      'remarks',
      'date_approved',
      'nedb_id', // ✅ always last
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(
      approvals.map((a) => ({
        request_id: a.request_id,
        user_id: a.user_id,
        name: a.name,
        role_id: a.role_id,
        status_id: Number(a.status_id),
        remarks: a.remarks,
        date_approved: a.date_approved,
        nedb_id: a._id || '',
      }))
    );

    fs.writeFileSync(CSV_FILE, csv);
    console.log(`💾 Approvals exported to ${CSV_FILE}`);
  } catch (err) {
    console.error('❌ CSV export error:', err.message);
  }
}


// 🚀 Load test data to approvals API
async function testApprovalsAPI() {
  try {
    const approvals = await readApprovalsFromCSV(CSV_FILE);
    console.log(`📄 Loaded ${approvals.length} approvals from CSV.`);

    for (const approval of approvals) {
      try {
        const payload = { ...approval };
        // If re-seeding from snapshot, _id may exist; up to API whether to respect it
        const response = await axios.post(BASE_URL, payload);
        console.log(`✅ Created approval: ${approval.approval_id}`);
        console.log('📦 Response:', response.data);
      } catch (err) {
        if (err.response) {
          console.error(
            `❌ Failed to create approval "${approval.approval_id}":`,
            err.response.data
          );
        } else {
          console.error(
            `❌ Error posting approval "${approval.approval_id}":`,
            err.message
          );
        }
      }
    }

    // 🧾 Fetch all approvals
    const getAll = await axios.get(BASE_URL);
    console.log(`📋 Total approvals in DB: ${getAll.data.length}`);
    console.log('📂 Approvals:', getAll.data);

    // ✅ Export snapshot with nedb_id
    await exportApprovalsToCSV(getAll.data);
  } catch (err) {
    console.error('❌ CSV or API error:', err.message);
  }
}

module.exports = { testApprovalsAPI, exportApprovalsToCSV };
