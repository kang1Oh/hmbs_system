const Datastore = require('nedb');
const path = require('path');

// Simulated table-like collections
const db = {
  users: new Datastore({ filename: path.join(__dirname, 'databases', 'users.db'), autoload: true }),
  roles: new Datastore({ filename: path.join(__dirname, 'databases', 'roles.db'), autoload: true }),
  tools: new Datastore({ filename: path.join(__dirname, 'databases', 'tools.db'), autoload: true }),
  categories: new Datastore({ filename: path.join(__dirname, 'databases', 'categories.db'), autoload: true }),
  statuses: new Datastore({ filename: path.join(__dirname, 'databases', 'statuses.db'), autoload: true }),
  borrowRequests: new Datastore({ filename: path.join(__dirname, 'databases', 'borrow_requests.db'), autoload: true }),
  borrowItems: new Datastore({ filename: path.join(__dirname, 'databases', 'borrow_items.db'), autoload: true }),
  approvals: new Datastore({ filename: path.join(__dirname, 'databases', 'approvals.db'), autoload: true }),
  releases: new Datastore({ filename: path.join(__dirname, 'databases', 'releases.db'), autoload: true }),
  groups: new Datastore({ filename: path.join(__dirname, 'databases', 'groups.db'), autoload: true }),
};

console.log("HBMS NeDB collections loaded.");
module.exports = db;

