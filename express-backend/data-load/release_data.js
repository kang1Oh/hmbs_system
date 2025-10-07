// seeder: release_data.js
const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const { Parser } = require('json2csv');

const CSV_FILE = '../../csv_files/releases.csv';
const BASE_URL = 'http://localhost:5000/api/releases';

// 📥 Reads releases from CSV
function readReleasesFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const releases = [];

    fs.createReadStream(filePath)
      .pipe(
        csv({
          mapHeaders: ({ header }) => header.trim().replace(/^"+|"+$/g, ''), // clean headers
        })
      )
      .on('data', (row) => {
        console.log('🧾 Raw Row:', row);

        const request_id = row['request_id']?.trim();
        const released_by = row['released_by']?.trim();
        const release_date = row['release_date']?.trim();
        const nedb_id = row['nedb_id']?.trim();

        if (request_id && released_by && release_date) {
          const parsed = {
            request_id: (request_id),
            released_by,
            release_date,
            _id: nedb_id || undefined, // include _id if present
          };
          console.log('✅ Parsed Release:', parsed);
          releases.push(parsed);
        } else {
          console.warn('⚠️ Skipping row due to missing fields:', row);
        }
      })
      .on('end', () => resolve(releases))
      .on('error', reject);
  });
}

// 📝 Write releases (with NeDB _id) back to CSV
async function exportReleasesToCSV() {
  try {
    const response = await axios.get(BASE_URL);
    const releases = response.data;

    const fields = [
      'request_id',
      'released_by',
      'release_date',
      'nedb_id', // ✅ always last column
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(
      releases.map((r) => ({
        request_id: r.request_id,
        released_by: r.released_by,
        release_date: r.release_date,
        nedb_id: r._id || '',
      }))
    );

    fs.writeFileSync(CSV_FILE, csv);
    console.log(`💾 Releases exported to ${CSV_FILE}`);
  } catch (err) {
    console.error('❌ CSV export error:', err.message);
  }
}


// 🚀 Load releases into the API
async function testReleasesAPI() {
  try {
    const releases = await readReleasesFromCSV(CSV_FILE);
    console.log(`📄 Loaded ${releases.length} releases from CSV.`);

    for (const release of releases) {
      try {
        const response = await axios.post(BASE_URL, release);
        console.log(`✅ Created release: ${release._id}`);
        console.log('📦 Response:', response.data);
      } catch (err) {
        if (err.response) {
          console.error(
            `❌ Failed to create release "${release._id}":`,
            err.response.data
          );
        } else {
          console.error(
            `❌ Error posting release "${release._id}":`,
            err.message
          );
        }
      }
    }

    // 🧾 Fetch all releases
    const getAll = await axios.get(BASE_URL);
    console.log(`📋 Total releases in DB: ${getAll.data.length}`);
    console.log('📂 Releases:', getAll.data);

    // ✅ Export snapshot with nedb_id
    await exportReleasesToCSV(getAll.data);
  } catch (err) {
    console.error('❌ CSV or API error:', err.message);
  }
}

module.exports = { testReleasesAPI, exportReleasesToCSV };
