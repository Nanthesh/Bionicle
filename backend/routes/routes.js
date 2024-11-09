const express = require('express');
const userController = require('../controllers/userControllers');
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');
const Redis = require('redis');
const RedisStore = require('rate-limit-redis'); 
const authMiddleware = require('../middlewares/authMiddleware');
const { forgotPassword, resetPassword, checkUserType } = require('../controllers/authController');
const { check, validationResult } = require('express-validator');
const User = require('../models/userModels');
const UserProfile = require('../models/userProfile');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userProfileController');
const jwt = require('jsonwebtoken');
// Register route
router.post('/user/register', userController.createUserControllerFunc);

router.post('/user/google-login', authController.googleLogin);

// Create Redis client
const redisClient = Redis.createClient();

// Set up rate limiting using Redis as the store
const loginLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,  
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: {
    code: 429,
    description: "Too many login attempts from this IP, please try again after 15 minutes",
  },
});

router.post('/user/login', loginLimiter, authController.loginUser);
router.get('/user/login/protected', authMiddleware, (req, res) => {
    res.status(200).json({
      code: 0,
      description: 'Successful!',
      username: req.user.username,
      userId: req.user.users_id,
      email: req.user.email
    });
  });

// Route for checking if user is Google or local
router.post('/user/check-user', checkUserType);

// Route for handling forgot password (local users)
router.post('/user/forgot-password', forgotPassword);

// Route for handling password reset
router.post('/user/reset-password', resetPassword);

router.put('/user/profile',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('phone_number', 'Please include a valid phone number').isMobilePhone('any'),  // Validate international numbers
  ],
  authMiddleware,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, phone_number } = req.body;
      const userId = req.user.id; // Use user ID from the token

      // Fetch the user from the database
      let user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update the user's profile data
      user.email = email || user.email;
      user.phone_number = phone_number || user.phone_number;

      // Save the updated user back to the database
      await user.save();

      res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

router.get('/user/profile', authMiddleware, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user.id });  // Use userId from the token
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/profile', authMiddleware, getUserProfile);

router.put('/profile', authMiddleware, updateUserProfile);


router.post('/validate-token', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token is invalid or expired' });
    }

    res.status(200).json({ message: 'Token is valid' });
  });
});

module.exports = router;
