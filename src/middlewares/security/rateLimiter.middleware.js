const rateLimit = require('express-rate-limit');

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: {
      status: 'error',
      message: 'Too many requests from this IP, please try again later.'
  },
  skip: (req) => {
      // Skip rate limiting if user is admin
      return req.user && req.user.role === 'admin';
  }
});

// Stricter limiter for authentication routes
const createFilmLimiter = rateLimit({
    windowMs: 60 * 60 * 1000 * 24, // 1 day
    max: 3, // Limit each IP to 3 create film per day
    message: {
      status: 'error',
      message: 'Too many create film attempts. Please try again later.'
    },
    skip: (req) => {
      return req.user && req.user.role === 'admin';
    }
});

const createCommentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000 * 24, // 1 day
  max: 2, // Limit each IP to 2 comment per day
  message: {
    status: 'error',
    message: 'Too many create comment attempts. Please try again next day.'
  }, skip: (req) => {
    return req.user && req.user.role === 'admin';
  }
});

const resendOTPLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1, // Limit each IP to 1 resend OTP per minute
  message: {
    status: 'error',
    message: 'Too many resend OTP attempts. Please try again later.'
  }
});

module.exports = {
  generalLimiter,
  createFilmLimiter,
  createCommentLimiter,
  resendOTPLimiter
};