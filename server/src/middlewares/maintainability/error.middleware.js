//server/src/middlewares/maintainability/error.middleware.js
const { logger } = require('../../utils/maintainability/logger.utils');
const { ErrorResponse } = require('../../utils/maintainability/response.utils');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  // Log error
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
    path: req.originalUrl
  });

  // Send error response
  if (process.env.NODE_ENV === 'development') {
    return ErrorResponse(res, err.message, err.statusCode, err.stack);
  }

  // Production error response
  if (err.isOperational) {
    return ErrorResponse(res, err.message, err.statusCode);
  }

  // Programming or unknown errors
  return ErrorResponse(res, 'Something went wrong', 500);
};

module.exports = {
  AppError,
  errorHandler
};