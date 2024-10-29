const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'random#secret';

// Middleware to verify the JWT token
const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];  // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  // Verify the token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid Token', error: err.message });
    }

    // If the token is valid, attach the decoded user data to the request object
    req.user = decoded;
    next();  // Continue to the next middleware or route handler
  });
};

module.exports = authMiddleware;
