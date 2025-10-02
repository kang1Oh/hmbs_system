// export_all.js
const { exportUsersToCSV } = require('../data-load/users_data');
const { exportToolsToCSV } = require('../data-load/tools_data');
const { exportReleasesToCSV } = require('../data-load/release_data');
const { exportReturnsToCSV } = require('../data-load/returns_data');
const { exportGroupsToCSV } = require('../data-load/groups_data');
const { exportBorrowRequestsToCSV } = require('../data-load/borrow_requests_data');
const { exportBorrowItemsToCSV } = require('../data-load/borrow_items_data');
const { exportApprovalsToCSV } = require('../data-load/approvals_data');

async function runExportAll() {
  try {
    console.log('📦 Starting exports...');

    await exportUsersToCSV();
    await exportToolsToCSV();
    await exportReleasesToCSV();
    await exportReturnsToCSV();
    await exportGroupsToCSV();
    await exportBorrowRequestsToCSV();
    await exportBorrowItemsToCSV();
    await exportApprovalsToCSV();

    console.log('✅ All exports completed successfully!');
  } catch (err) {
    console.error('❌ Error during export_all:', err.message);
  }
}

runExportAll();
