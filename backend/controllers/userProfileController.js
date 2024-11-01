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
    const {
        userName,
        firstName,
        lastName,
        email,
        phone_number,
        address,
        city,
        state,
        zipCode,
        country
    } = req.body;

    try {
        // Find the user by ID
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields with provided data or retain existing values
        user.userName = userName || user.userName;
        user.firstName= firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.phone_number = phone_number || user.phone_number;
        user.address = address || user.address;
        user.city = city || user.city;
        user.state = state || user.state;
        user.zipCode = zipCode || user.zipCode;
        user.country = country || user.country;

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error("Error updating profile:", error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = { getUserProfile, updateUserProfile };
