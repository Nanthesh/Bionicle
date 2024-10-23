const express = require('express');
const userController = require('../controllers/userControllers');
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');
const Redis = require('redis');
const RedisStore = require('rate-limit-redis'); 
const authMiddleware = require('../middlewares/authMiddleware');
const { forgotPassword, resetPassword, checkUserType } = require('../controllers/authController');

const router = express.Router();

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


module.exports = router;
