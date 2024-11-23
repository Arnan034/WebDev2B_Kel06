//server/src/middlewares/maintainability/error.middleware.js
const { logger } = require('../../utils/maintainability/logger.utils');
const ApiResponse = require('../../utils/maintainability/response.utils');

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
  return ApiResponse.error(
    res,
    err.message,
    err.statusCode,
    process.env.NODE_ENV === 'development' ? err.stack : null
  );
};

module.exports = errorHandler;