const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS middleware
const authRoutes = require('./routes/authRoutes');
const characterRoutes = require('./routes/characterRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

// Initialize the Express app
const app = express();
const PORT = 5000;

// Middleware to enable CORS
app.use(cors({
    origin: 'http://192.168.50.201:8080', // Replace with your frontend's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies if necessary
}));

// Middleware to parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/inventory', inventoryRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
