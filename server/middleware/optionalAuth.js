const jwt = require('jsonwebtoken');
const User = require('../models/User');

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mockpro_secret_key_2024');
      if (decoded && decoded.userId) {
        const user = await User.findById(decoded.userId).select('-password');
        if (user) {
          req.user = user;
        }
      }
    }
  } catch (err) {
    // Ignore invalid or expired token for optional auth
  }
  next();
};

module.exports = optionalAuth;
