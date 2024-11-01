const User = require('../models/userModels');

// Get User Profile
const getUserProfile = async (req, res) => {
    console.log('Decoded user ID:', req.user.id);
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password field
        if (!user) {
            console.log('User profile not found in database');
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error',error: error.message});
    }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
    const { userName, email, phone_number } = req.body;
    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields
        user.userName = userName || user.userName;
        user.email = email || user.email;
        user.phone_number = phone_number || user.phone_number;

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { getUserProfile, updateUserProfile };
