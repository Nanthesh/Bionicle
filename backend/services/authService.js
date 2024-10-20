// authService.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModels');
const { jwtSecret } = require('../config/app.keys');
const fs = require('fs');

// Function to find a user by email
const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// Function to validate password
const validatePassword = async (user, password) => {
  return user.comparePassword(password);
};

// Function to generate a JWT token
const generateToken = (user) => {
  return jwt.sign(
    { users_id: user.users_id, email: user.email, username: user.username },
    jwtSecret,
    { expiresIn: '1h' }
  );
};

// Function to log failed login attempts
const logFailedAttempt = (req, email) => {
  const logMessage = `Failed login attempt for email: ${email}, IP: ${req.ip}, Time: ${new Date().toISOString()}\n`;
  fs.appendFile('failed-logins.log', logMessage, (err) => {
    if (err) console.error('Failed to write to log file:', err);
  });
};

// Service function to handle login
const loginService = async (email, password, req) => {
  try {
    console.log(`Finding user by email: ${email}`);
    const user = await findUserByEmail(email);
    
    if (!user) {
      console.log("User not found for email:", email);
      logFailedAttempt(req, email);
      return { success: false, message: 'User not found' };
    }

    console.log("User found, validating password...");
    const isMatch = await validatePassword(user, password);

    if (!isMatch) {
      console.log("Password mismatch for email:", email);
      logFailedAttempt(req, email);
      return { success: false, message: 'Invalid credentials' };
    }

    console.log("Password matched, generating token...");
    const token = generateToken(user);
    return { success: true, token };
  } catch (error) {
    console.error("Error in loginService:", error);
    return { success: false, message: 'Server error', error: error.message };
  }
};

// Service function to handle Google Login
const googleLoginService = async (userData) => {
  try {
    const { email, userName, uid, provider, phone_number } = userData;

    // Log received Google user data
    console.log("Received Google user data:", userData);

    // Check if the user already exists in the database
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create a new user if not found
      console.log("Creating new Google user...");
      user = new User({
        userName: userName,
        email: email,
        users_id: uid, // Use Firebase UID as unique ID
        provider: provider,
        password: null, // No password required for Google users
        phone_number: phone_number
      });
      await user.save();
      console.log("New Google user created successfully.");
    } else {
      console.log("Existing user found for email:", email);
    }

    // Generate a JWT token
    const token = jwt.sign(
      { users_id: user.users_id, email: user.email, username: user.userName },
      jwtSecret,
      { expiresIn: '1h' }
    );

    console.log("Generated JWT token for Google user.");
    return { success: true, token };
  } catch (error) {
    console.error("Error during Google login service:", error);
    return { success: false, message: "Google login failed", error: error.message };
  }
};

module.exports = {
  loginService,
  logFailedAttempt,
  googleLoginService, // Export the new Google Login Service
};
