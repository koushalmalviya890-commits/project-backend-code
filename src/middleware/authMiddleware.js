// import jwt from 'jsonwebtoken';
const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  const token = req.cookies.token; // Read the same cookie we set in login

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // This adds { id, userType } to the request object
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};