const mongoose = require('mongoose');

// Define the schema for a User
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Automatically trim whitespace from the username
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email'], // Basic email format validation
  },
  password: {
    type: String,
    required: true, // In a real application, hash the password
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Create the model
const User = mongoose.model('User', userSchema);

module.exports = User;
