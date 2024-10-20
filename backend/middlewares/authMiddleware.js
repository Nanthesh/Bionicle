const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/app.keys');

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];  // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);  // Verify and decode token
    req.user = decoded;  // Attach decoded payload to req.user
    next();  // Move on to the next middleware or route
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
