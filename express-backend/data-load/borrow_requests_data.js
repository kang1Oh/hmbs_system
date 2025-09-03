const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

const CSV_FILE = '../../csv_files/borrow_requests.csv';
const BASE_URL = 'http://localhost:5000/api/borrow-requests'; 

// 🧠 Read borrow requests from CSV
function readBorrowRequestsFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const requests = [];

    fs.createReadStream(filePath)
      .pipe(csv({
        mapHeaders: ({ header }) => header.trim().replace(/^"+|"+$/g, '') // Clean headers
      }))
      .on('data', (row) => {
        console.log('🧾 Raw Row:', row);

        const {
          request_id,
          student_id,
          status_id,
          request_slip_id,
          lab_date,
          date_requested
        } = row;

        // Only accept rows with all required fields
        if (
          request_id && student_id && status_id &&
          request_slip_id && lab_date && date_requested
        ) {
          const parsed = {
            request_id: request_id.trim(),
            student_id: student_id.trim(),
            status_id: status_id.trim(),
            request_slip_id: request_slip_id.trim(),
            lab_date: lab_date.trim(),
            date_requested: date_requested.trim()
          };
          console.log('✅ Parsed:', parsed);
          requests.push(parsed);
        } else {
          console.warn('⚠️ Skipping row due to missing fields:', row);
        }
      })
      .on('end', () => resolve(requests))
      .on('error', reject);
  });
}

// 🚀 Load test data to API
async function testBorrowRequestsAPI() {
  try {
    const requests = await readBorrowRequestsFromCSV(CSV_FILE);
    console.log(`📄 Loaded ${requests.length} borrow requests from CSV.`);

    for (const request of requests) {
      try {
        const response = await axios.post(BASE_URL, request);
        console.log(`✅ Created request_id: ${request.request_id}`);
        console.log('📦 Response:', response.data);
      } catch (err) {
        if (err.response) {
          console.error(`❌ Failed to create request_id "${request.request_id}":`, err.response.data);
        } else {
          console.error(`❌ Error posting request_id "${request.request_id}":`, err.message);
        }
      }
    }

    const getAll = await axios.get(BASE_URL);
    console.log(`📋 Total borrow requests in DB: ${getAll.data.length}`);
    console.log('📂 Requests:', getAll.data);

  } catch (err) {
    console.error('❌ CSV or API error:', err.message);
  }
}

testBorrowRequestsAPI();
