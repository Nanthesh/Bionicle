const mongoose = require('mongoose');
const { mongoURI } = require('../config/db.conf');

// Function to connect to MongoDB
const connectMongoDB = async () => {
  try {
    await mongoose.connect(mongoURI);  // No options needed for newer MongoDB drivers
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process if unable to connect to DB
  }
};

module.exports = connectMongoDB;
