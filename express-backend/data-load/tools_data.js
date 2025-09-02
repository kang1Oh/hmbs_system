const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

const CSV_FILE = '/Users/jaimeemanuellucero/Documents/hmbs_system/csv_files/tools.csv';
const BASE_URL = 'http://localhost:8000/api/tools';

function readToolsFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const tools = [];

    fs.createReadStream(filePath)
      .pipe(csv({
        mapHeaders: ({ header }) => header.replace(/^"+|"+$/g, '').trim()
      }))
      .on('data', (row) => {
        console.log('🧾 Raw Row:', row);

        const tool_id = row.tool_id?.trim();
        const category_id = row.category_id?.trim();
        const name = row.name?.trim();
        const available_qty = row.available_qty?.trim();
        const unit = row.unit?.trim();
        const img = row.img?.trim() || '';
        const quantity = row.quantity?.trim();
        const disposal_status = row.disposal_status?.trim();

        if (tool_id && category_id && name && available_qty && unit && quantity) {
          const parsedTool = {
            tool_id,
            category_id,
            name,
            available_qty: parseInt(available_qty),
            unit,
            img,
            quantity: parseInt(quantity),
            disposal_status,
          };

          console.log('✅ Parsed tool:', parsedTool);
          tools.push(parsedTool);
        } else {
          console.warn('⚠️ Skipping row due to missing required fields:', row);
        }
      })
      .on('end', () => resolve(tools))
      .on('error', reject);
  });
}



// 🚀 Test the tools API
async function testToolsAPI() {
  try {
    const tools = await readToolsFromCSV(CSV_FILE);
    console.log(`📄 Loaded ${tools.length} tools from CSV.`);

    for (const tool of tools) {
      try {
        const response = await axios.post(BASE_URL, tool);
        console.log(`✅ Created tool: ${tool.name}`);
        console.log('📦 Response:', response.data);
      } catch (err) {
        if (err.response) {
          console.error(`❌ Failed to create "${tool.name}":`, err.response.data);
        } else {
          console.error(`❌ Error posting "${tool.name}":`, err.message);
        }
      }
    }

    // 🧾 Fetch all tools
    const getAll = await axios.get(BASE_URL);
    console.log(`📋 Total tools in DB: ${getAll.data.length}`);
    console.log('📂 Tools:', getAll.data);

  } catch (err) {
    console.error('❌ CSV or API error:', err.message);
  }
}

testToolsAPI();
