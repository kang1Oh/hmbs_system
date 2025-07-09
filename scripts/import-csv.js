const fs = require('fs');
const csv = require('csv-parser');  // CSV parsing library
const path = require('path');
const Datastore = require('nedb');  // NeDB for interacting with the database

// Define the path to your CSV files
const rolesCSV = path.join(__dirname, '../csv_files/roles.csv');
const usersCSV = path.join(__dirname, '../csv_files/users.csv');
const borrowRequestsCSV = path.join(__dirname, '../csv_files/borrow_requests.csv');
const approvalsCSV = path.join(__dirname, '../csv_files/approvals.csv');
const groupsCSV = path.join(__dirname, '../csv_files/groups.csv');
const categoriesCSV = path.join(__dirname, '../csv_files/categories.csv');
const toolsCSV = path.join(__dirname, '../csv_files/tools.csv');
const borrowItemsCSV = path.join(__dirname, '../csv_files/borrow_items.csv');
const releasesCSV = path.join(__dirname, '../csv_files/releases.csv');
const statusesCSV = path.join(__dirname, '../csv_files/statuses.csv');  // New CSV added

// Define the NeDB databases (ensure these match the folder and file names of your .db files)
const rolesDB = new Datastore({ filename: path.join(__dirname, '../databases/roles.db'), autoload: true });
const usersDB = new Datastore({ filename: path.join(__dirname, '../databases/users.db'), autoload: true });
const borrowRequestsDB = new Datastore({ filename: path.join(__dirname, '../databases/borrow_requests.db'), autoload: true });
const approvalsDB = new Datastore({ filename: path.join(__dirname, '../databases/approvals.db'), autoload: true });
const groupsDB = new Datastore({ filename: path.join(__dirname, '../databases/groups.db'), autoload: true });
const categoriesDB = new Datastore({ filename: path.join(__dirname, '../databases/categories.db'), autoload: true });
const toolsDB = new Datastore({ filename: path.join(__dirname, '../databases/tools.db'), autoload: true });
const borrowItemsDB = new Datastore({ filename: path.join(__dirname, '../databases/borrow_items.db'), autoload: true });
const releasesDB = new Datastore({ filename: path.join(__dirname, '../databases/releases.db'), autoload: true });
const statusesDB = new Datastore({ filename: path.join(__dirname, '../databases/statuses.db'), autoload: true });  // New DB added

// Function to import data from CSV and insert into NeDB
const importCSVData = (csvPath, db) => {
  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (row) => {
      db.insert(row, (err) => {
        if (err) console.log("Error inserting data", err);
      });
    })
    .on('end', () => {
      console.log(`CSV import complete for ${csvPath}`);
    });
};

// Start importing the data
importCSVData(rolesCSV, rolesDB);
importCSVData(usersCSV, usersDB);
importCSVData(borrowRequestsCSV, borrowRequestsDB);
importCSVData(approvalsCSV, approvalsDB); 
importCSVData(groupsCSV, groupsDB);
importCSVData(categoriesCSV, categoriesDB);
importCSVData(toolsCSV, toolsDB);
importCSVData(borrowItemsCSV, borrowItemsDB);
importCSVData(releasesCSV, releasesDB);
importCSVData(statusesCSV, statusesDB); // Import approvals CSV
