const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

const CSV_FILE = '/Users/jaimeemanuellucero/Documents/hmbs_system/csv_files/releases.csv';
const BASE_URL = 'http://localhost:8000/api/releases'; // Change if your route differs

// 📥 Reads releases from CSV
function readReleasesFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const releases = [];

    fs.createReadStream(filePath)
      .pipe(csv({
        mapHeaders: ({ header }) => header.trim().replace(/^"+|"+$/g, '') // Clean headers
      }))
      .on('data', (row) => {
        console.log('🧾 Raw Row:', row);

        const release_id = row['release_id']?.trim();
        const request_id = row['request_id']?.trim();
        const released_by = row['released_by']?.trim();
        const release_date = row['release_date']?.trim();

        if (release_id && request_id && released_by && release_date) {
          const parsed = {
            release_id,
            request_id,
            released_by,
            release_date
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

// 🚀 Load releases into the API
async function testReleasesAPI() {
  try {
    const releases = await readReleasesFromCSV(CSV_FILE);
    console.log(`📄 Loaded ${releases.length} releases from CSV.`);

    for (const release of releases) {
      try {
        const response = await axios.post(BASE_URL, release);
        console.log(`✅ Created release: ${release.release_id}`);
        console.log('📦 Response:', response.data);
      } catch (err) {
        if (err.response) {
          console.error(`❌ Failed to create release "${release.release_id}":`, err.response.data);
        } else {
          console.error(`❌ Error posting release "${release.release_id}":`, err.message);
        }
      }
    }

    // 🧾 Optional: Fetch all releases
    const getAll = await axios.get(BASE_URL);
    console.log(`📋 Total releases in DB: ${getAll.data.length}`);
    console.log('📂 Releases:', getAll.data);

  } catch (err) {
    console.error('❌ CSV or API error:', err.message);
  }
}

testReleasesAPI();
