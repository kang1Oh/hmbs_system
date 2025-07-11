const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

const CSV_FILE = '/Users/jaimeemanuellucero/Documents/hmbs_system/csv_files/approvals.csv';
const BASE_URL = 'http://localhost:8000/api/approvals'; // Update if needed

// 📥 Read approvals from CSV
function readApprovalsFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const approvals = [];

    fs.createReadStream(filePath)
      .pipe(csv({
        mapHeaders: ({ header }) => header.trim().replace(/^"+|"+$/g, '') // Remove quotes & trim
      }))
      .on('data', (row) => {
        console.log('🧾 Raw Row:', row);

        const approval_id = row['approval_id']?.trim();
        const request_id = row['request_id']?.trim();
        const user_id = row['user_id']?.trim();
        const decision = row['decision']?.trim();
        const remarks = row['remarks']?.trim() || '';

        if (approval_id && request_id && user_id && decision) {
          const parsed = {
            approval_id,
            request_id,
            user_id,
            decision,
            remarks
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

// 🚀 Load test data to approvals API
async function testApprovalsAPI() {
  try {
    const approvals = await readApprovalsFromCSV(CSV_FILE);
    console.log(`📄 Loaded ${approvals.length} approvals from CSV.`);

    for (const approval of approvals) {
      try {
        const response = await axios.post(BASE_URL, approval);
        console.log(`✅ Created approval: ${approval.approval_id}`);
        console.log('📦 Response:', response.data);
      } catch (err) {
        if (err.response) {
          console.error(`❌ Failed to create approval "${approval.approval_id}":`, err.response.data);
        } else {
          console.error(`❌ Error posting approval "${approval.approval_id}":`, err.message);
        }
      }
    }

    // 🧾 Fetch all approvals
    const getAll = await axios.get(BASE_URL);
    console.log(`📋 Total approvals in DB: ${getAll.data.length}`);
    console.log('📂 Approvals:', getAll.data);

  } catch (err) {
    console.error('❌ CSV or API error:', err.message);
  }
}

testApprovalsAPI();
