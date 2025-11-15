// // server.js | index.js
// require('dotenv').config();
// const express = require('express');
// const session = require('express-session');
// const NedbStore = require('nedb-session-store')(session);
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
// const path = require('path');

// const app = express();

// const port = process.env.PORT || 5000;  // Backend runs on port 5000, fallback to 8000 if .env is missing
// const host = '0.0.0.0'; // Enables access from other devices

// // --- CORS ---
// app.use(
//   cors({
//     origin: 'http://localhost:5173', // React dev server
//     credentials: true,
//   })
// );

// // --- Parsers ---
// app.use(cookieParser());
// app.use(express.json());

// // --- Sessions ---
// app.use(
//   session({
//     name: 'hmbs.sid',
//     secret: process.env.SESSION_SECRET || 'supersecretkey',
//     resave: false,
//     saveUninitialized: false,
//     store: new NedbStore({
//       filename: path.join(__dirname, 'data', 'sessions.db'), // persistent session file
//     }),
//     cookie: {
//       httpOnly: true,
//       sameSite: 'lax',
//       secure: false,
//       maxAge: 1000 * 60 * 60 * 24, // 1 day
//     },
//   })
// );

// // Example route
// app.get('/', (req, res) => {
//   res.send('Hello from Express!');
// });

// // serve static files
// app.use("/csv_exports", express.static(path.join(__dirname, "csv_exports")));
// app.use("/pdf", express.static(path.join(__dirname, "pdf")));
// app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));


// // Routes Mounting
// const roleRoutes = require('./routes/roles_routes');
// const userRoutes = require('./routes/users_routes');
// const approvalRoutes = require('./routes/approvals_routes');
// const borrowRequestsRoutes = require('./routes/borrow_requests_routes');
// const borrowItemsRoutes = require('./routes/borrow_items_routes');
// const toolRoutes = require('./routes/tools_routes');
// const categoryRoutes = require('./routes/categories_routes');
// const statusRoutes = require('./routes/statuses_routes');
// const groupRoutes = require('./routes/groups_routes');
// const releaseRoutes = require('./routes/release_routes');
// const returnRoutes = require('./routes/returns_routes');

// app.use('/api/roles', roleRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/approvals', approvalRoutes);
// app.use('/api/borrow-requests', borrowRequestsRoutes);
// app.use('/api/borrow-items', borrowItemsRoutes);
// app.use('/api/tools', toolRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/statuses', statusRoutes);
// app.use('/api/groups', groupRoutes);
// app.use('/api/releases', releaseRoutes);
// app.use('/api/returns', returnRoutes);


// // Start the server
// app.listen(port, host, () => {
//   console.log(`Server is running at http://${host}:${port}`);
// });

// server.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const pool = require('./models/db'); // PostgreSQL pool

const app = express();
const port = process.env.PORT || 5000;
const host = '0.0.0.0';

// --- Verify PostgreSQL connection ---
pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL'))
  .catch(err => console.error('❌ PostgreSQL connection error:', err));

// --- CORS ---
app.use(cors({
  origin: 'http://localhost:5173', // React dev server
  credentials: true,
}));

// --- Parsers ---
app.use(cookieParser());
app.use(express.json());

// --- Sessions (stored in PostgreSQL) ---
app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: 'session',
    }),
    name: 'hmbs.sid',
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// --- Static directories ---
app.use('/csv_exports', express.static(path.join(__dirname, 'csv_exports')));
app.use('/pdf', express.static(path.join(__dirname, 'pdf')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// --- Routes ---
app.use('/api/roles', require('./routes/roles_routes'));
app.use('/api/users', require('./routes/users_routes'));
app.use('/api/approvals', require('./routes/approvals_routes'));
app.use('/api/borrow-requests', require('./routes/borrow_requests_routes'));
app.use('/api/borrow-items', require('./routes/borrow_items_routes'));
app.use('/api/tools', require('./routes/tools_routes'));
app.use('/api/categories', require('./routes/categories_routes'));
app.use('/api/statuses', require('./routes/statuses_routes'));
app.use('/api/groups', require('./routes/groups_routes'));
app.use('/api/releases', require('./routes/release_routes'));
app.use('/api/returns', require('./routes/returns_routes'));

app.get('/', (req, res) => res.send('Hello from HMBS PostgreSQL backend!'));

// --- Start server ---
app.listen(port, host, () => {
  console.log(`🚀 Server running at http://${host}:${port}`);
});
