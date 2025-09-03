const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const Datastore = require('nedb');

// ---- CSV paths
const rolesCSV = path.join(__dirname, '../csv_files/roles.csv');
const usersCSV = path.join(__dirname, '../csv_files/users.csv');
const borrowRequestsCSV = path.join(__dirname, '../csv_files/borrow_requests.csv');
const approvalsCSV = path.join(__dirname, '../csv_files/approvals.csv');
const groupsCSV = path.join(__dirname, '../csv_files/groups.csv');
const categoriesCSV = path.join(__dirname, '../csv_files/categories.csv');
const toolsCSV = path.join(__dirname, '../csv_files/tools.csv');
const borrowItemsCSV = path.join(__dirname, '../csv_files/borrow_items.csv');
const releasesCSV = path.join(__dirname, '../csv_files/releases.csv');
const statusesCSV = path.join(__dirname, '../csv_files/statuses.csv'); 

// ---- NeDB files
const rolesDB = new Datastore({ filename: path.join(__dirname, '../databases/roles.db'), autoload: true });
const usersDB = new Datastore({ filename: path.join(__dirname, '../databases/users.db'), autoload: true });
const borrowRequestsDB = new Datastore({ filename: path.join(__dirname, '../databases/borrow_requests.db'), autoload: true });
const approvalsDB = new Datastore({ filename: path.join(__dirname, '../databases/approvals.db'), autoload: true });
const groupsDB = new Datastore({ filename: path.join(__dirname, '../databases/groups.db'), autoload: true });
const categoriesDB = new Datastore({ filename: path.join(__dirname, '../databases/categories.db'), autoload: true });
const toolsDB = new Datastore({ filename: path.join(__dirname, '../databases/tools.db'), autoload: true });
const borrowItemsDB = new Datastore({ filename: path.join(__dirname, '../databases/borrow_items.db'), autoload: true });
const releasesDB = new Datastore({ filename: path.join(__dirname, '../databases/releases.db'), autoload: true });
const statusesDB = new Datastore({ filename: path.join(__dirname, '../databases/statuses.db'), autoload: true });

// --- Helper for disposal status (tools.csv only) ---
function normalizeDisposalStatus(value) {
  if (!value || value.trim() === "") return "Not Applicable"; // empty → Not Applicable
  return value.trim(); // keep CSV value as is
}

// --- Generic CSV Importer ---
const importCSVData = (csvPath, db, isTools = false) => {
  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (row) => {
      if (isTools) {
        row.disposalStatus = normalizeDisposalStatus(row.disposalStatus);
      }
      db.insert(row, (err) => {
        if (err) console.error("Error inserting data", err);
      });
    })
    .on('end', () => {
      console.log(`✅ CSV import complete for ${csvPath}`);
    });
};

// ---- Run imports (all CSVs)
importCSVData(rolesCSV, rolesDB);
importCSVData(usersCSV, usersDB);
importCSVData(borrowRequestsCSV, borrowRequestsDB);
importCSVData(approvalsCSV, approvalsDB);
importCSVData(groupsCSV, groupsDB);
importCSVData(categoriesCSV, categoriesDB);
importCSVData(toolsCSV, toolsDB, { isTools: true });
importCSVData(borrowItemsCSV, borrowItemsDB);
importCSVData(releasesCSV, releasesDB);
importCSVData(statusesCSV, statusesDB); 
