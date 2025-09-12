// seeder.js
const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const { Parser } = require('json2csv');

const CSV_FILE = '../../csv_files/borrow_items.csv';
const BASE_URL = 'http://localhost:5000/api/borrow-items';

// 📥 Read borrow items from CSV
function readBorrowItemsFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const items = [];

    fs.createReadStream(filePath)
      .pipe(
        csv({
          mapHeaders: ({ header }) =>
            header.trim().replace(/^"+|"+$/g, ''), // Clean headers
        })
      )
      .on('data', (row) => {
        console.log('🧾 Raw Row:', row);

        const borrow_item_id = row['borrow_item_id']?.trim();
        const request_id = row['request_id']?.trim();
        const tool_id = row['tool_id']?.trim();
        const requested_qty = row['requested_qty']?.trim();

        if (borrow_item_id && request_id && tool_id && requested_qty) {
          const parsed = {
            borrow_item_id: borrow_item_id,
            request_id: request_id,
            tool_id: tool_id,
            requested_qty: parseInt(requested_qty),
          };
          console.log('✅ Parsed:', parsed);
          items.push(parsed);
        } else {
          console.warn('⚠️ Skipping row due to missing fields:', row);
        }
      })
      .on('end', () => resolve(items))
      .on('error', reject);
  });
}

// 📝 Write borrow items (with NeDB _id) back to CSV
async function exportBorrowItemsToCSV(data) {
  try {
    const fields = [
      'borrow_item_id',
      'request_id',
      'tool_id',
      'requested_qty',
      'nedb_id', // ✅ new column at the end
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(
      data.map((item) => ({
        borrow_item_id: item.borrow_item_id,
        request_id: item.request_id,
        tool_id: item.tool_id,
        requested_qty: item.requested_qty,
        nedb_id: item._id || '',
      }))
    );

    fs.writeFileSync(CSV_FILE, csv);
    console.log(`💾 Borrow items exported to ${CSV_FILE}`);
  } catch (err) {
    console.error('❌ CSV export error:', err.message);
  }
}

// 🚀 Load test data to API
async function testBorrowItemsAPI() {
  try {
    const items = await readBorrowItemsFromCSV(CSV_FILE);
    console.log(`📄 Loaded ${items.length} borrow items from CSV.`);

    for (const item of items) {
      try {
        await axios.post(BASE_URL, item);
        console.log(
          `✅ Created borrow_item_id: ${item.borrow_item_id} (Tool ${item.tool_id} for Request ${item.request_id})`
        );
      } catch (err) {
        if (err.response) {
          console.error(
            `❌ Failed to create borrow_item_id "${item.borrow_item_id}":`,
            err.response.data
          );
        } else {
          console.error(
            `❌ Error posting borrow_item_id "${item.borrow_item_id}":`,
            err.message
          );
        }
      }
    }

    // 🧾 Fetch all
    const getAll = await axios.get(BASE_URL);
    console.log(`📋 Total borrow items in DB: ${getAll.data.length}`);
    console.log('📂 Borrow Items:', getAll.data);

    // ✅ Export back to CSV with nedb_id
    await exportBorrowItemsToCSV(getAll.data);
  } catch (err) {
    console.error('❌ CSV or API error:', err.message);
  }
}

module.exports = { testBorrowItemsAPI, exportBorrowItemsToCSV };
