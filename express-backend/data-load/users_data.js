// seeder.js
const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

const CSV_FILE = '../../csv_files/users.csv';
const BASE_URL = 'http://localhost:5000/api/users'; 

// Reads users from CSV with headers: user_id, role_id, email, password, name
function readUsersFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const users = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        console.log('🧾 Row:', row); // Debugging
        users.push({
          user_id: row.user_id?.trim() || '',
          role_id: row.role_id?.trim() || '',
          email: row.email?.trim() || '',
          password: row.password?.trim() || '', // keep plain
          name: row.name?.trim() || ''
        });
      })
      .on('end', () => resolve(users))
      .on('error', reject);
  });
}

async function seedUsers() {
  try {
    const users = await readUsersFromCSV(CSV_FILE);
    console.log(`📄 Loaded ${users.length} users from CSV.`);

    for (const user of users) {
      try {
        const payload = {
          user_id: user.user_id,
          role_id: user.role_id,
          email: user.email,
          password: user.password, // plain text password now
          name: user.name
        };

        const response = await axios.post(BASE_URL, payload);
        console.log(`✅ Created user: ${user.name}`);
        console.log('📦 Response:', response.data);
      } catch (err) {
        if (err.response) {
          console.error(`❌ Failed to create "${user.name}":`, err.response.data);
        } else {
          console.error(`❌ Error posting user "${user.name}":`, err.message);
        }
      }
    }

    // Optional: Fetch all users
    const getAll = await axios.get(BASE_URL);
    console.log(`📋 Total users in DB: ${getAll.data.length}`);
    console.log('📂 Users:', getAll.data);

  } catch (err) {
    console.error('❌ CSV or API error:', err.message);
  }
}

seedUsers();
