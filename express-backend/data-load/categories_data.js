const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

const CSV_FILE = '../../csv_files/categories.csv';
const BASE_URL = 'http://localhost:5000/api/categories'; 

// 🔄 Read CSV rows with: category_id, category_name
function readCategoriesFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const categories = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        console.log('🧾 Raw Row:', row);

        // Normalize keys: lowercased and trimmed
        const normalizedRow = {};
        Object.keys(row).forEach(key => {
          const cleanKey = key.trim().toLowerCase();
          normalizedRow[cleanKey] = row[key]?.trim();
        });

        const category_id = normalizedRow['category_id'];
        const category_name = normalizedRow['category_name'];

        if (category_id && category_name) {
          categories.push({ category_id, category_name });
        }
      })
      .on('end', () => resolve(categories))
      .on('error', reject);
  });
}


// 🚀 Test categories API
async function testCategoriesAPI() {
  try {
    const categories = await readCategoriesFromCSV(CSV_FILE);
    console.log(`📄 Loaded ${categories.length} categories from CSV.`);

    for (const category of categories) {
      try {
        const response = await axios.post(BASE_URL, category);
        console.log(`✅ Created category: ${category.name}`);
        console.log('📦 Response:', response.data);
      } catch (err) {
        if (err.response) {
          console.error(`❌ Failed to create "${category.name}":`, err.response.data);
        } else {
          console.error(`❌ Error posting "${category.name}":`, err.message);
        }
      }
    }

    // 🧾 Fetch all categories
    const getAll = await axios.get(BASE_URL);
    console.log(`📋 Total categories in DB: ${getAll.data.length}`);
    console.log('📂 Categories:', getAll.data);

  } catch (err) {
    console.error('❌ CSV or API error:', err.message);
  }
}

testCategoriesAPI();
