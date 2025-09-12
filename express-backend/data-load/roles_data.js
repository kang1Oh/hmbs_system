const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

const CSV_FILE = '../../csv_files/roles.csv';
const BASE_URL = 'http://localhost:5000/api/roles'; 

// Reads CSV with headers: role_id, role_name
function readRolesFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const roles = [];

    fs.createReadStream(filePath)
      .pipe(csv())
        .on('data', (row) => {
        const cleanRow = {
            role_id: row['role_id']?.trim() || row['﻿role_id']?.trim(),
            role_name: row['role_name']?.trim() || row['﻿role_name']?.trim()
        };

        if (cleanRow.role_id && cleanRow.role_name) {
            roles.push({ id: cleanRow.role_id, name: cleanRow.role_name });
        }
        })
      .on('end', () => resolve(roles))
      .on('error', reject);
  });
}

async function testRolesAPI() {
  try {
    const roles = await readRolesFromCSV(CSV_FILE);
    console.log(`📄 Loaded ${roles.length} roles from CSV.`);

    for (const role of roles) {
      try {
        const response = await axios.post(BASE_URL, role);
        console.log(`✅ Created role: ${role.name}`);
        console.log('📦 Response data:', response.data);
      } catch (err) {
        if (err.response) {
          console.error(`❌ Failed to create role "${role.name}":`, err.response.data);
        } else {
          console.error(`❌ Error creating role "${role.name}":`, err.message);
        }
      }
    }

    // Fetch all roles
    const getAll = await axios.get(BASE_URL);
    console.log(`📋 Total roles in DB: ${getAll.data.length}`);
    console.log('📂 Roles:', getAll.data);

  } catch (err) {
    console.error('❌ CSV or API error:', err.message);
  }
}

module.exports = { testRolesAPI };

