// reset_db.js
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'models');
const dbFiles = [
  'users.db',
  'tools.db',
  'releases.db',
  'groups.db',
  'borrow_requests.db',
  'borrow_items.db',
  'approvals.db'
];

dbFiles.forEach(file => {
  const filePath = path.join(DB_PATH, file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`🗑️ Deleted ${file}`);
  }
});

console.log('✅ All NeDB files reset.');
