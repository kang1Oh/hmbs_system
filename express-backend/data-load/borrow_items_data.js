const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

const CSV_FILE = '/Users/jaimeemanuellucero/Documents/hmbs_system/csv_files/borrow_items.csv';
const BASE_URL = 'http://localhost:8000/api/borrow-items';

// 📥 Read borrow items from CSV
function readBorrowItemsFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const items = [];

    fs.createReadStream(filePath)
      .pipe(csv({
        mapHeaders: ({ header }) => header.trim().replace(/^"+|"+$/g, '') // Clean headers
      }))
      .on('data', (row) => {
        console.log('🧾 Raw Row:', row);

        const borrow_item_id = row['borrow_item_id']?.trim();
        const request_id = row['request_id']?.trim();
        const tool_id = row['tool_id']?.trim();
        const requested_qty = row['requested_qty']?.trim();

        if (borrow_item_id && request_id && tool_id && requested_qty) {
          const parsed = {
            borrow_item_id,
            request_id,
            tool_id,
            requested_qty: parseInt(requested_qty)
          };
          console.log('✅ Parsed Item:', parsed);
          items.push(parsed);
        } else {
          console.warn('⚠️ Skipping row due to missing fields:', row);
        }
      })
      .on('end', () => resolve(items))
      .on('error', reject);
  });
}

// 🚀 Load test data to API
async function testBorrowItemsAPI() {
  try {
    const items = await readBorrowItemsFromCSV(CSV_FILE);
    console.log(`📄 Loaded ${items.length} borrow items from CSV.`);

    for (const item of items) {
      try {
        const response = await axios.post(BASE_URL, item);
        console.log(`✅ Created borrow item: Tool ${item.tool_id} for Request ${item.request_id}`);
        console.log('📦 Response:', response.data);
      } catch (err) {
        if (err.response) {
          console.error(`❌ Failed to create borrow item for request "${item.request_id}":`, err.response.data);
        } else {
          console.error(`❌ Error posting item for request "${item.request_id}":`, err.message);
        }
      }
    }

    // 🧾 Fetch all
    const getAll = await axios.get(BASE_URL);
    console.log(`📋 Total borrow items in DB: ${getAll.data.length}`);
    console.log('📂 Borrow Items:', getAll.data);

  } catch (err) {
    console.error('❌ CSV or API error:', err.message);
  }
}

testBorrowItemsAPI();
