const User = require('../models/userModel');

// Controller to get a user's username by ID
const getUserName = async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from request parameters

    // Fetch the user by ID, only selecting the username field
    const user = await User.findById(id).select('username');

    if (!user) {
      return res.status(404).json({ message: 'User not found' }); // Return 404 if user not found
    }

    res.status(200).json({ username: user.username }); // Return the username in the response
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getUserName };
