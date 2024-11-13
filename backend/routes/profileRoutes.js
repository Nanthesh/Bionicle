const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');  // Path to your auth middleware
const UserProfile = require('../models/userProfile');  // Path to your UserProfile model

// Update user profile
router.put('/user/profile',
  [
    check('firstName', 'First Name is required').notEmpty(),
    check('lastName', 'Last Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('phone_number', 'Please include a valid phone number').notEmpty(),
    check('addressLine1', 'Address Line 1 is required').notEmpty(),
    check('city', 'City is required').notEmpty(),
    check('state', 'State is required').notEmpty(),
    check('zipCode', 'Zip Code is required').notEmpty(),
    check('country', 'Country is required').notEmpty(),
  ],
  authMiddleware,  // Middleware to verify JWT
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, phone_number, addressLine1, city, state, zipCode, country } = req.body;

    try {
      // Find profile by userId, which is extracted from the token by authMiddleware
      let profile = await UserProfile.findOne({ userId: req.user.id });

      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }

      // Update profile fields
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.email = email;
      profile.phone_number = phone_number;
      profile.addressLine1 = addressLine1;
      profile.city = city;
      profile.state = state;
      profile.zipCode = zipCode;
      profile.country = country;

      await profile.save();

      res.status(200).json({ message: 'Profile updated successfully', profile });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

module.exports = router;
