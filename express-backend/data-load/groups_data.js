const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

const CSV_FILE = '../../csv_files/groups.csv';
const BASE_URL = 'http://localhost:5000/api/groups'; 

// 🔁 Read groups from CSV
function readGroupsFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const groups = [];

    fs.createReadStream(filePath)
      .pipe(csv({
        mapHeaders: ({ header }) => header.trim().replace(/^"+|"+$/g, '') // clean headers
      }))
      .on('data', (row) => {
        console.log('🧾 Raw Row:', row);

        const request_id = row['request_id']?.trim();
        const user_id = row['user_id']?.trim();
        const is_leader_raw = row['is_leader']?.trim();

        if (requested_id && user_id && is_leader_raw !== undefined) {
          const parsed = {
            request_id,
            user_id,
            is_leader: is_leader_raw.toLowerCase() === 'true' || is_leader_raw === '1'
          };
          console.log('✅ Parsed Group:', parsed);
          groups.push(parsed);
        } else {
          console.warn('⚠️ Skipping row due to missing fields:', row);
        }
      })
      .on('end', () => resolve(groups))
      .on('error', reject);
  });
}

// 🚀 Load test data to API
async function testGroupsAPI() {
  try {
    const groups = await readGroupsFromCSV(CSV_FILE);
    console.log(`📄 Loaded ${groups.length} group records from CSV.`);

    for (const group of groups) {
      try {
        const response = await axios.post(BASE_URL, group);
        console.log(`✅ Added group: user ${group.user_id} in request ${group.requested_id}`);
        console.log('📦 Response:', response.data);
      } catch (err) {
        if (err.response) {
          console.error(`❌ Failed to create group for user "${group.user_id}":`, err.response.data);
        } else {
          console.error(`❌ Error posting group for user "${group.user_id}":`, err.message);
        }
      }
    }

    const getAll = await axios.get(BASE_URL);
    console.log(`📋 Total groups in DB: ${getAll.data.length}`);
    console.log('📂 Groups:', getAll.data);

  } catch (err) {
    console.error('❌ CSV or API error:', err.message);
  }
}

testGroupsAPI();
