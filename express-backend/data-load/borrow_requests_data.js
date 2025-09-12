// seeder.js
const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const { Parser } = require('json2csv');

const CSV_FILE = '../../csv_files/borrow_requests.csv';
const BASE_URL = 'http://localhost:5000/api/borrow-requests';

// 🧠 Read borrow requests from CSV
function readBorrowRequestsFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const requests = [];

    fs.createReadStream(filePath)
      .pipe(
        csv({
          mapHeaders: ({ header }) =>
            header.trim().replace(/^"+|"+$/g, ''), 
        })
      )
      .on('data', (row) => {
        console.log('🧾 Raw Row:', row);

        const {
          request_id,
          user_id,        
          status_id,
          request_slip_id,
          lab_date,
          date_requested,
          lab_time,
          course,
        } = row;

        if (
          request_id &&
          user_id &&
          status_id &&
          request_slip_id &&
          lab_date &&
          date_requested
        ) {
          const parsed = {
            request_id: request_id.trim(),
            user_id: user_id.trim(),
            status_id: status_id.trim(),
            request_slip_id: request_slip_id.trim(),
            lab_date: lab_date.trim(),
            date_requested: date_requested.trim(),
            lab_time: lab_time ? lab_time.trim() : '',
            course: course ? course.trim() : '',
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

// 📝 Write borrow requests (with NeDB _id) back to CSV
async function exportBorrowRequestsToCSV(data) {
  try {
    const fields = [
      'request_id',
      'user_id',
      'status_id',
      'request_slip_id',
      'lab_date',
      'date_requested',
      'lab_time',
      'course',
      'nedb_id', // ✅ new column at the end
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(
      data.map((req) => ({
        request_id: req.request_id,
        user_id: req.user_id,
        status_id: req.status_id,
        request_slip_id: req.request_slip_id,
        lab_date: req.lab_date,
        date_requested: req.date_requested,
        lab_time: req.lab_time || '',
        course: req.course || '',
        nedb_id: req._id || '',
      }))
    );

    fs.writeFileSync(CSV_FILE, csv);
    console.log(`💾 Borrow requests exported to ${CSV_FILE}`);
  } catch (err) {
    console.error('❌ CSV export error:', err.message);
  }
}

// 🚀 Load test data to API
async function testBorrowRequestsAPI() {
  try {
    const requests = await readBorrowRequestsFromCSV(CSV_FILE);
    console.log(`📄 Loaded ${requests.length} borrow requests from CSV.`);

    for (const request of requests) {
      try {
        await axios.post(BASE_URL, request);
        console.log(`✅ Created request_id: ${request.request_id}`);
      } catch (err) {
        if (err.response) {
          console.error(
            `❌ Failed to create request_id "${request.request_id}":`,
            err.response.data
          );
        } else {
          console.error(
            `❌ Error posting request_id "${request.request_id}":`,
            err.message
          );
        }
      }
    }

    const getAll = await axios.get(BASE_URL);
    console.log(`📋 Total borrow requests in DB: ${getAll.data.length}`);
    console.log('📂 Requests:', getAll.data);

    // ✅ Export back to CSV with nedb_id
    await exportBorrowRequestsToCSV(getAll.data);
  } catch (err) {
    console.error('❌ CSV or API error:', err.message);
  }
}

module.exports = { testBorrowRequestsAPI, exportBorrowRequestsToCSV };
