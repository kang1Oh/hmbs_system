// users_data.js
const fs = require('fs');
const csv = require('csv-parser');
const { parse } = require('json2csv'); // for writing CSV
const axios = require('axios');

const CSV_FILE = '../../csv_files/users.csv';
const BASE_URL = 'http://localhost:5000/api/users';

// 📥 Reads users from CSV, including _id, active, createdAt
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
          active:
            row.active?.toLowerCase() === 'true'
              ? true
              : row.active?.toLowerCase() === 'false'
              ? false
              : true, // default true
          createdAt: row.createdAt ? Number(row.createdAt) : Date.now(),
          _id: row._id?.trim() || undefined,
        });
      })
      .on('end', () => resolve(users))
      .on('error', reject);
  });
}

// 📤 Seeds users into DB
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
          active: user.active,
          createdAt: user.createdAt,
        };

        if (user._id) payload._id = user._id; // Preserve NeDB _id

        await axios.post(BASE_URL, payload);
        console.log(`✅ Created user: ${user.name}`);
      } catch (err) {
        if (err.response) {
          console.error(
            `❌ Failed to create "${user.name}":`,
            err.response.data
          );
        } else {
          console.error(
            `❌ Error posting user "${user.name}":`,
            err.message
          );
        }
      }
    }

    const getAll = await axios.get(BASE_URL);
    console.log(`📋 Total users in DB: ${getAll.data.length}`);
  } catch (err) {
    console.error('❌ CSV or API error:', err.message);
  }
}

// 📤 Export DB state to CSV
async function exportUsersToCSV() {
  try {
    const response = await axios.get(`${BASE_URL}/with-passwords`);
    let users = response.data;

    // Sort by numeric user_id ascending
    users.sort((a, b) => Number(a.user_id) - Number(b.user_id));

    const fields = [
      'user_id',
      'role_id',
      'email',
      'password',
      'name',
      'active',
      'createdAt',
      '_id',
    ];

    const csv = parse(
      users.map((u) => ({
        user_id: u.user_id,
        role_id: u.role_id,
        email: u.email,
        password: u.password,
        name: u.name,
        active: u.active,
        createdAt:
          typeof u.createdAt === 'object' && u.createdAt.$$date
            ? u.createdAt.$$date
            : u.createdAt,
        _id: u._id || '',
      })),
      { fields }
    );

    fs.writeFileSync(CSV_FILE, csv);

    console.log(
      `📤 Overwrote ${CSV_FILE} with ${users.length} users (sorted by user_id).`
    );
  } catch (err) {
    console.error('❌ Error exporting users to CSV:', err.message);
  }
}

module.exports = { seedUsers, exportUsersToCSV };
