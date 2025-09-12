// seeder: groups_data.js
const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const { Parser } = require('json2csv');

const CSV_FILE = '../../csv_files/groups.csv';
const BASE_URL = 'http://localhost:5000/api/groups';

// 🔁 Read groups from CSV
function readGroupsFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const groups = [];

    fs.createReadStream(filePath)
      .pipe(
        csv({
          mapHeaders: ({ header }) => header.trim().replace(/^"+|"+$/g, ''), // clean headers
        })
      )
      .on('data', (row) => {
        console.log('🧾 Raw Row:', row);

        const request_id = row['request_id']?.trim();
        const user_id = row['user_id']?.trim();
        const is_leader_raw = row['is_leader']?.trim();

        if (request_id && user_id && is_leader_raw !== undefined) {
          const parsed = {
            request_id,
            user_id,
            is_leader:
              is_leader_raw.toLowerCase() === 'true' || is_leader_raw === '1',
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

// 📝 Write groups (with NeDB _id) back to CSV
async function exportGroupsToCSV(data) {
  try {
    const fields = [
      'request_id',
      'user_id',
      'is_leader',
      'nedb_id', // ✅ always last column
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(
      data.map((g) => ({
        request_id: g.request_id,
        user_id: g.user_id,
        is_leader: g.is_leader,
        nedb_id: g._id || '',
      }))
    );

    fs.writeFileSync(CSV_FILE, csv);
    console.log(`💾 Groups exported to ${CSV_FILE}`);
  } catch (err) {
    console.error('❌ CSV export error:', err.message);
  }
}

// 🚀 Load test data to API
async function testGroupsAPI() {
  try {
    const groups = await readGroupsFromCSV(CSV_FILE);
    console.log(`📄 Loaded ${groups.length} group records from CSV.`);

    for (const group of groups) {
      try {
        const response = await axios.post(BASE_URL, group);
        console.log(
          `✅ Added group: user ${group.user_id} in request ${group.request_id}`
        );
        console.log('📦 Response:', response.data);
      } catch (err) {
        if (err.response) {
          console.error(
            `❌ Failed to create group for user "${group.user_id}":`,
            err.response.data
          );
        } else {
          console.error(
            `❌ Error posting group for user "${group.user_id}":`,
            err.message
          );
        }
      }
    }

    const getAll = await axios.get(BASE_URL);
    console.log(`📋 Total groups in DB: ${getAll.data.length}`);
    console.log('📂 Groups:', getAll.data);

    // ✅ Export back to CSV with nedb_id
    await exportGroupsToCSV(getAll.data);
  } catch (err) {
    console.error('❌ CSV or API error:', err.message);
  }
}

module.exports = { testGroupsAPI, exportGroupsToCSV };
