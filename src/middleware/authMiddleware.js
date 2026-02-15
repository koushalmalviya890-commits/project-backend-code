// import jwt from 'jsonwebtoken';
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token = req.cookies.token; // Read the same cookie we set in login

// 2. Check Header as fallback (For API clients/Postman)
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // This adds { id, userType } to the request object
   if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const optionalProtect = async (req, res, next) => {
  let token = req.cookies.token;

  // Check Header as fallback
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // If token is valid, fetch user
      req.user = await User.findById(decoded.id).select('-password');
      
    } catch (error) {
      // Token exists but is invalid/expired -> Treat as Guest
      console.log("Optional Auth: Token invalid, proceeding as guest.");
      req.user = null;
    }
  } else {
    // No token -> Guest
    req.user = null;
  }
  
  next();
};

module.exports = { protect, optionalProtect };