// master_seeder.js
async function runSeeders() {
  try {
    console.log("🔄 Resetting and seeding all collections...");

    const { seedUsers } = require('../data-load/users_data');
    const { seedTools } = require('../data-load/tools_data');
    const { testApprovalsAPI } = require('../data-load/approvals_data');
    const { testBorrowItemsAPI } = require('../data-load/borrow_items_data');
    const { testBorrowRequestsAPI } = require('../data-load/borrow_requests_data');
    const { testCategoriesAPI } = require('../data-load/categories_data');
    const { testGroupsAPI } = require('../data-load/groups_data');
    const { testReleasesAPI } = require('../data-load/release_data');
    const { testReturnsAPI } = require('../data-load/returns_data');
    const { testRolesAPI } = require('../data-load/roles_data');
    const { testStatusesAPI } = require('../data-load/statuses_data');

    // call them in order (reset + insert)
    await seedUsers();
    await testRolesAPI();
    await testCategoriesAPI();
    await seedTools();
    await testBorrowRequestsAPI();
    await testGroupsAPI();
    await testBorrowItemsAPI();
    await testApprovalsAPI();
    await testReleasesAPI();
    await testReturnsAPI();
    await testStatusesAPI();

    console.log("✅ Seeding completed!");
  } catch (err) {
    console.error("❌ Error during seeding:", err);
  }
}

runSeeders();
