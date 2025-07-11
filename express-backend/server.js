// index.js
require('dotenv').config();
const express = require('express');
const app = express();

const port = process.env.PORT || 8000;  // Backend runs on port 5000, fallback to 8000 if .env is missing
const host = '0.0.0.0'; // Enables access from other devices

// Database connection

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


const cors = require('cors');
app.use(cors()); // Allow all origins by default

// Middleware to parse JSON
app.use(express.json());

// Example route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Mount routes
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
