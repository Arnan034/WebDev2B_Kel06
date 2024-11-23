const { verifyToken } = require('../../utils/security/jwt.utils');

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. No token provided.'
      });
    }

    // Memisahkan "Bearer" dari token
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token format.'
      });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token.'
    });
  }
};

// Middleware untuk routes yang bisa diakses admin & user
const isAuthenticated = (req, res, next) => {
  // Menggunakan x-role dan toLowerCase() untuk case-insensitive comparison
  const role = (req.headers['x-role'] || '').toLowerCase();
  
  if (role === 'admin' || role === 'user') {
    next();
  } else {
    res.status(403).json({
      status: 'error',
      message: 'Access denied. Invalid role.'
    });
  }
};

// Khusus untuk fitur admin
const isAdmin = (req, res, next) => {
  if (req.headers['x-role'] === 'admin') {
    next();
  } else {
    res.status(403).json({
      status: 'error',
      message: 'Access denied. Admin rights required.'
    });
  }
};

module.exports = {
  authenticateToken,
  isAuthenticated,
  isAdmin
};