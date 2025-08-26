// server.js | index.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 5000;  // Backend runs on port 5000, fallback to 8000 if .env is missing
const host = '0.0.0.0'; // Enables access from other devices

// --- CORS ---
app.use(
  cors({
    origin: 'http://localhost:5173', // or whatever your front URL is
    credentials: true,
  })
);

// --- Parsers ---
app.use(cookieParser());
app.use(express.json());

// --- Sessions ---
app.use(
  session({
    name: 'hmbs.sid',
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',   // good for same-origin (via Vite proxy)
      secure: false,     // true only behind HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Example route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Routes Mounting
const roleRoutes = require('./routes/roles_routes');
const userRoutes = require('./routes/users_routes');
const approvalRoutes = require('./routes/approvals_routes');
const borrowRequestsRoutes = require('./routes/borrow_requests_routes');
const borrowItemsRoutes = require('./routes/borrow_items_routes');
const toolRoutes = require('./routes/tools_routes');
const categoryRoutes = require('./routes/categories_routes');
const statusRoutes = require('./routes/statuses_routes');
const groupRoutes = require('./routes/groups_routes');
const releaseRoutes = require('./routes/release_routes');

app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/borrow-requests', borrowRequestsRoutes);
app.use('/api/borrow-items', borrowItemsRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/statuses', statusRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/releases', releaseRoutes);


// Start the server
app.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
});
