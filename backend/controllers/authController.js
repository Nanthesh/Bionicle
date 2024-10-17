const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { jwtSecret } = require('../config/app.keys');
const fs = require('fs');

// Login a user using email and password
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      logFailedAttempt(req, email);  // Log the failed attempt
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare entered password with stored hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logFailedAttempt(req, email);  // Log the failed attempt
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT with users_id, email, and username in the payload
    const token = jwt.sign({ users_id: user.users_id, email: user.email, username: user.username }, jwtSecret, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Function to log failed login attempts
const logFailedAttempt = (req, email) => {
  const logMessage = `Failed login attempt for email: ${email}, IP: ${req.ip}, Time: ${new Date().toISOString()}\n`;
  fs.appendFile('failed-logins.log', logMessage, (err) => {
    if (err) console.error('Failed to write to log file:', err);
  });
};

module.exports = { loginUser };
