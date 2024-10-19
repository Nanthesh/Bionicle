// authController.js
const { loginService } = require('../services/authService');
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
module.exports = { loginUser };
