// index.js
const express = require('express');
const app = express();
const port = 8000; // Backend runs on port 5000

// Routes Mounting
const roleRoutes = require('./routes/roles_routes');

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


// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
