const jwt = require('jsonwebtoken');
const User = require('../models/userModels');
const fs = require('fs');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET || 'random#secret';

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
    { id: user._id, email: user.email, username: user.username }, // Use _id instead of users_id
    SECRET_KEY,
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
      { id: user._id, email: user.email, username: user.userName }, // Changed to _id
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    console.log("Generated JWT token for Google user.");
    return { success: true, token };
  } catch (error) {
    console.error("Error during Google login service:", error);
    return { success: false, message: "Google login failed", error: error.message };
  }
};

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const resetPasswordService = async (token, newPassword) => {
  try {
    console.log('Received token:', token); // Log the token received for debugging

    const decoded = jwt.verify(token, SECRET_KEY);
    console.log('Decoded token:', decoded); // Log the decoded payload

    const user = await User.findOne({
      email: decoded.email,
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() } // Ensure the token is not expired
    });

    if (!user) {
      console.log('User not found or token is invalid/expired');
      return { success: false, message: 'Invalid or expired token' };
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password and clear reset token fields
    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    return { success: true, message: 'Password has been reset successfully' };
  } catch (error) {
    console.error('Error resetting password:', error);
    return { success: false, message: 'Error resetting password', error: error.message };
  }
};

// Function to send password reset email
const sendLocalResetEmail = async (email, resetUrl) => {
  const msg = {
    to: email,
    from: 'bionicle658@gmail.com', // Your verified sender email
    subject: 'Password Reset Request',
    text: `You requested a password reset. Click the following link to reset your password: ${resetUrl}`,
    html: `<strong>Click the link to reset your password: <a href="${resetUrl}">Reset Password</a></strong>`,
  };

  await sgMail.send(msg);
};

// Forgot password service
const forgotPasswordService = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (!user.password) {
      return { success: false, message: 'This user uses Google Auth. Please reset your password using Google.' };
    }

    const resetToken = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    // Store the token and expiration in the database
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour from now
    await user.save();

    await sendLocalResetEmail(email, resetUrl);
    return { success: true, message: 'Password reset email sent for local user. Check your inbox.' };
  } catch (error) {
    console.error("Error in forgotPasswordService:", error);
    return { success: false, message: 'Error processing the request', error: error.message };
  }
};

// Service function to check user type (local vs Google)
const checkUserTypeService = async (email) => {
  try {
    // Find user by email in the database
    const user = await User.findOne({ email });

    // If user not found, return null
    if (!user) {
      return null;
    }

    // Determine the user type based on whether the password field is set
    const userType = user.password ? 'local' : 'google';
    return userType;
  } catch (error) {
    console.error("Error in checkUserTypeService:", error);
    throw new Error('Error checking user type');  // Let the controller handle this error
  }
};

// Middleware to verify token and authenticate users
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token', error: err.message });
  }
};

// Export all services and middleware
module.exports = {
  loginService,
  logFailedAttempt,
  googleLoginService,
  forgotPasswordService,
  resetPasswordService,
  checkUserTypeService,
  authMiddleware, // Ensure the auth middleware is exported
};
