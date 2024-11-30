const { verifyToken } = require('../../utils/security/jwt.utils');
const {cmsLogger} = require('../../utils/maintainability/logger.utils');

const authenticateToken = (req, res, next) => {
  const start = Date.now();
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      cmsLogger.error('No token provided:', {
        duration: Date.now() - start
      });
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. No token provided.'
      });
    }

    // Memisahkan "Bearer" dari token
    const token = authHeader.split(' ')[1];
    if (!token) {
      cmsLogger.error('Invalid token format:', {
        duration: Date.now() - start
      });
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token format.'
      });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    cmsLogger.error('Invalid or expired token:', {
      duration: Date.now() - start
    });
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token.'
    });
  }
};

// Middleware untuk routes yang bisa diakses admin & user
const isAuthenticated = (req, res, next) => {
  const start = Date.now();
  // Menggunakan x-role dan toLowerCase() untuk case-insensitive comparison
  const role = (req.headers['x-role'] || '').toLowerCase();
  
  if (role === 'admin' || role === 'user') {
    next();
  } else {
    cmsLogger.error('Access denied. Invalid role:', {
      duration: Date.now() - start
    });
    res.status(403).json({
      status: 'error',
      message: 'Access denied. Invalid role.'
    });
  }
};

// Khusus untuk fitur admin
const isAdmin = (req, res, next) => {
  const start = Date.now();
  if (req.headers['x-role'] === 'admin') {
    next();
  } else {
    cmsLogger.error('Access denied. Admin rights required:', {
      duration: Date.now() - start
    });
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