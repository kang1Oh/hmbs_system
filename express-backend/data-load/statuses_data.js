const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

const CSV_FILE = '../../csv_files/statuses.csv';
const BASE_URL = 'http://localhost:5000/api/statuses'; 

// 🧾 Read statuses from CSV
function readStatusesFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const statuses = [];

    fs.createReadStream(filePath)
      .pipe(csv({
        mapHeaders: ({ header }) => header.replace(/^"+|"+$/g, '').trim()
      }))
      .on('data', (row) => {
        console.log('🧾 Raw Row:', row);

        const status_id = row.status_id?.trim();
        const status_label = row.status_label?.trim();

        if (status_id && status_label) {
          const status = { status_id, status_label };
          console.log('✅ Parsed status:', status);
          statuses.push(status);
        } else {
          console.warn('⚠️ Skipping row due to missing fields:', row);
        }
      })
      .on('end', () => resolve(statuses))
      .on('error', reject);
  });
}

// 🚀 Test script for statuses API
async function testStatusesAPI() {
  try {
    const statuses = await readStatusesFromCSV(CSV_FILE);
    console.log(`📄 Loaded ${statuses.length} statuses from CSV.`);

    for (const status of statuses) {
      try {
        const response = await axios.post(BASE_URL, status);
        console.log(`✅ Created status: ${status.status_label}`);
        console.log('📦 Response:', response.data);
      } catch (err) {
        if (err.response) {
          console.error(`❌ Failed to create "${status.status_label}":`, err.response.data);
        } else {
          console.error(`❌ Error posting "${status.status_label}":`, err.message);
        }
      }
    }

    // Optional: Get all statuses
    const allStatuses = await axios.get(BASE_URL);
    console.log(`📋 Total statuses in DB: ${allStatuses.data.length}`);
    console.log('📂 Statuses:', allStatuses.data);

  } catch (err) {
    console.error('❌ CSV or API error:', err.message);
  }
}

testStatusesAPI();
