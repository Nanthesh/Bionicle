const User = require('../models/userProfile');

// Get User Profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password field
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
    const { username, email, phone_number } = req.body;
    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields
        user.username = username || user.username;
        user.email = email || user.email;
        user.phone_number = phone_number || user.phone_number;

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { getUserProfile, updateUserProfile };
