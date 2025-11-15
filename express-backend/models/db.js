// // db.js
// const Datastore = require('nedb');
// const path = require('path');

// const db = {
//   users: new Datastore({ filename: path.join(__dirname, 'users.db'), autoload: true }),
//   tools: new Datastore({ filename: path.join(__dirname, 'tools.db'), autoload: true }),
//   borrowItems: new Datastore({ filename: path.join(__dirname, 'borrow_items.db'), autoload: true }),
//   borrowRequests: new Datastore({ filename: path.join(__dirname, 'borrow_requests.db'), autoload: true }),
//   categories: new Datastore({ filename: path.join(__dirname, 'categories.db'), autoload: true }),
//   roles: new Datastore({ filename: path.join(__dirname, 'roles.db'), autoload: true }),
//   statuses: new Datastore({ filename: path.join(__dirname, 'statuses.db'), autoload: true }),
//   approvals: new Datastore({ filename: path.join(__dirname, 'approvals.db'), autoload: true }),
//   groups: new Datastore({ filename: path.join(__dirname, 'groups.db'), autoload: true }),
//   releases: new Datastore({ filename: path.join(__dirname, 'releases.db'), autoload: true }),
//   returns: new Datastore({ filename: path.join(__dirname, 'returns.db'), autoload: true }),
// };

// module.exports = db;

// models/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

module.exports = pool;

