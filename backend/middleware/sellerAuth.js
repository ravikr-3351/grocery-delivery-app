/**
 * middleware/sellerAuth.js - Seller JWT authentication
 */

const jwt = require('jsonwebtoken');
const Seller = require('../models/Seller');

/**
 * Authenticate Seller - Verify JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    let token;

    // Check for Bearer token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach seller to request
    req.user = await Seller.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Seller not found' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
  }
};

module.exports = { authenticate };
