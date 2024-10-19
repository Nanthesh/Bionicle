const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET; 

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Assuming Bearer token

  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user; // Save user information in request
    next(); // Proceed to the next middleware or route
  });
};

module.exports = authenticateToken;
