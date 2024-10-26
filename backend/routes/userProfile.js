const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userProfileController');
const authMiddleware = require("../middlewares/authMiddleware");

// Get user profile
router.get('/profile', authMiddleware, getUserProfile);

// Update user profile
router.put('/profile', authMiddleware, updateUserProfile);

module.exports = router;
