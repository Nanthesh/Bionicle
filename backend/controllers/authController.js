// authController.js
const { loginService, googleLoginService } = require('../services/authService');
const { forgotPasswordService,resetPasswordService,checkUserTypeService } = require('../services/authService');
const User = require('../models/userModels');

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const loginResult = await loginService(email, password, req);

    if (loginResult.success) {
      return res.status(200).json({ token: loginResult.token });
    } else {
      const statusCode = loginResult.message === 'Server error' ? 500 : 400;
      return res.status(statusCode).json({ 
        message: loginResult.message,
        error: loginResult.error // Add error details if available
      });
    }
  } catch (error) {
    console.error("Login Error:", error); // Log the full error to console
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const googleLogin = async (req, res) => {
  try {
    const googleResult = await googleLoginService(req.body);

    if (googleResult.success) {
      return res.status(200).json({ token: googleResult.token });
    } else {
      return res.status(500).json({ message: googleResult.message, error: googleResult.error });
    }
  } catch (error) {
    console.error("Google Login Error:", error); // Log the full error to console
    return res.status(500).json({ message: 'Google login failed', error: error.message });
  }
};

//  reset password
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const result = await resetPasswordService(token, newPassword);

    if (result.success) {
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(400).json({ message: result.message });
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: 'Error resetting password' });
  }
};

// forgot password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await forgotPasswordService(email);

    if (result.success) {
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(400).json({ message: result.message });
    }
  } catch (error) {
    console.error("Error in forgot password:", error);
    return res.status(500).json({ message: 'Error processing forgot password' });
  }
};

// Check user type (Google or local auth)
const checkUserType = async (req, res) => {
  try {
    console.log(req.body);  // Log the request body for debugging
    const { email } = req.body;  // Destructure email from req.body

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const userType = await checkUserTypeService(email);
    if (!userType) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ userType });
  } catch (error) {
    console.error("Error checking user type:", error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { loginUser, googleLogin,forgotPassword,resetPassword,checkUserType };
