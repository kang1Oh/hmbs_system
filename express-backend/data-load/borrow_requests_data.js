// seeder: borrow_requests_data.js
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
          user_id,
          status_id,
          request_slip_id,
          lab_date,
          date_requested,
          lab_time,
          subject,
          instructor_id,
          _id, // 👈 pick up NeDB id if present
        } = row;

        if (
          user_id &&
          status_id &&
          request_slip_id &&
          lab_date &&
          date_requested
        ) {
          const parsed = {
            user_id: user_id.trim(),
            status_id: status_id.trim(),
            request_slip_id: request_slip_id.trim(),
            lab_date: lab_date.trim(),
            date_requested: date_requested.trim(),
            lab_time: lab_time ? lab_time.trim() : '',
            subject: subject ? subject.trim() : '',
            instructor_id: instructor_id ? instructor_id.trim() : '',
            _id: _id?.trim() || undefined, // 👈 preserve _id
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
        const payload = {
          user_id: (request.user_id),
          status_id: Number(request.status_id),
          request_slip_id: Number(request.request_slip_id),
          lab_date: request.lab_date,
          date_requested: request.date_requested,
          lab_time: request.lab_time,
          subject: request.subject,
          instructor_id: request.instructor_id
        };

        if (request._id) payload._id = request._id; // 👈 reuse NeDB id if exists

        await axios.post(BASE_URL, payload);
        console.log(`✅ Created borrow request for user_id: ${request.user_id}`);
      } catch (err) {
        if (err.response) {
          console.error(
            `❌ Failed to create borrow request for user_id "${request.user_id}":`,
            err.response.data
          );
        } else {
          console.error(
            `❌ Error posting borrow request for user_id "${request.user_id}":`,
            err.message
          );
        }
      }
    }

    const getAll = await axios.get(BASE_URL);
    console.log(`📋 Total borrow requests in DB: ${getAll.data.length}`);
    console.log('📂 Requests:', getAll.data);

    // ✅ Export back to CSV with _id
    await exportBorrowRequestsToCSV(getAll.data);
  } catch (err) {
    console.error('❌ CSV or API error:', err.message);
  }
}

// 📝 Write borrow requests (with NeDB _id) back to CSV
async function exportBorrowRequestsToCSV(data) {
  try {
    const response = await axios.get(BASE_URL);
    const borrowRequests = response.data;

    const fields = [
      'user_id',
      'status_id',
      'request_slip_id',
      'lab_date',
      'date_requested',
      'lab_time',
      'subject',
      'instructor_id',
      '_id', // ✅ last column, matches DB format
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(
      borrowRequests.map((req) => ({
        user_id: req.user_id,
        status_id: req.status_id,
        request_slip_id: req.request_slip_id,
        lab_date: req.lab_date,
        date_requested: req.date_requested,
        lab_time: req.lab_time || '',
        subject: req.subject || '',
        instructor_id: req.instructor_id || '',
        _id: req._id || '',
      }))
    );

    fs.writeFileSync(CSV_FILE, csv);
    console.log(`💾 Borrow requests exported to ${CSV_FILE}`);
  } catch (err) {
    console.error('❌ CSV export error:', err.message);
  }
}

module.exports = { testBorrowRequestsAPI, exportBorrowRequestsToCSV };
