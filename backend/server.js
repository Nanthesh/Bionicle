const express = require('express');
const dotenv = require('dotenv');
const connectMongoDB = require('./database/Mongo.database'); // Ensure this path is correct
          // Ensure this path is correct


// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
connectMongoDB();


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
