// server/src/middlewares/performance/performance.middleware.js
const { performance } = require('perf_hooks');
const { recordMetric } = require('../../utils/performance/performance.utils');

const performanceMiddleware = (req, res, next) => {
  const start = performance.now();

  // Add listener for when response finishes
  res.on('finish', () => {
    const duration = performance.now() - start;
    const path = req.route ? req.route.path : req.path;
    const method = req.method;

    recordMetric({
      path,
      method,
      duration,
      statusCode: res.statusCode,
      contentLength: res.get('Content-Length')
    });
  });

  next();
};

module.exports = performanceMiddleware;