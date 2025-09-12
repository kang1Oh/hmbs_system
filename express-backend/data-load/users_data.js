// users_data.js
const fs = require('fs');
const csv = require('csv-parser');
const { parse } = require('json2csv'); // for writing CSV
const axios = require('axios');

const CSV_FILE = '../../csv_files/users.csv';
const BASE_URL = 'http://localhost:5000/api/users';

// Reads users from CSV, optional _id at end
function readUsersFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const users = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        users.push({
          user_id: row.user_id?.trim() || '',
          role_id: row.role_id?.trim() || '',
          email: row.email?.trim() || '',
          password: row.password?.trim() || '',
          name: row.name?.trim() || '',
          _id: row._id?.trim() || undefined // only if already in CSV
        });
      })
      .on('end', () => resolve(users))
      .on('error', reject);
  });
}

// Seeds users into DB
async function seedUsers() {
  try {
    const users = await readUsersFromCSV(CSV_FILE);
    console.log(`📄 Loaded ${users.length} users from CSV.`);

    for (const user of users) {
      try {
        const payload = {
          user_id: Number(user.user_id),
          role_id: Number(user.role_id),
          email: user.email,
          password: user.password,
          name: user.name,
        };

        // Include _id if present, prevents NeDB generating a new one
        if (user._id) payload._id = user._id;

        const response = await axios.post(BASE_URL, payload);
        console.log(`✅ Created user: ${user.name}`);
      } catch (err) {
        if (err.response) {
          console.error(`❌ Failed to create "${user.name}":`, err.response.data);
        } else {
          console.error(`❌ Error posting user "${user.name}":`, err.message);
        }
      }
    }

    const getAll = await axios.get(BASE_URL);
    console.log(`📋 Total users in DB: ${getAll.data.length}`);

  } catch (err) {
    console.error('❌ CSV or API error:', err.message);
  }
}

// Exports DB state to CSV with _id appended
async function exportUsersToCSV() {
  try {
    const response = await axios.get(BASE_URL);
    const users = response.data;

    const fields = ['user_id', 'role_id', 'email', 'password', 'name', '_id'];
    const csv = parse(users, { fields });

    fs.writeFileSync(CSV_FILE, csv);
    console.log(`📤 Overwrote ${CSV_FILE} with ${users.length} users (including _id).`);
  } catch (err) {
    console.error('❌ Error exporting users to CSV:', err.message);
  }
}

module.exports = { seedUsers, exportUsersToCSV };
