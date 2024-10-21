const express = require('express');
const rateLimit = require('express-rate-limit');
const Redis = require('redis');
const RedisStore = require('rate-limit-redis'); // Old version where RedisStore was a constructor
const { loginUser } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Create Redis client
const redisClient = Redis.createClient();

// Set up rate limiting using Redis as the store
const loginLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,  // Use Redis client
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: {
    code: 429,
    description: "Too many login attempts from this IP, please try again after 15 minutes",
  },
});

// Apply rate limiting to the login route
router.post('/login', loginLimiter, loginUser);

// Protected route (example)
router.get('/protected', authMiddleware, (req, res) => {
  res.status(200).json({
    code: 0,
    description: 'Successful!',
    username: req.user.username,
    userId: req.user.users_id,
    email: req.user.email
  });
});

module.exports = router;
