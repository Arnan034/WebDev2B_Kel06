const { monitor } = require('../../utils/maintainability/monitor.utils');
const logger = require('../utils/logger.utils');

const monitorMiddleware = (req, res, next) => {
  const startTime = process.hrtime();
  const startMemory = process.memoryUsage();

  res.on('finish', () => {
    const diff = process.hrtime(startTime);
    const time = diff[0] * 1e3 + diff[1] * 1e-6; // Convert to milliseconds
    const endMemory = process.memoryUsage();

    const data = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: time,
      memoryDelta: {
        heapUsed: endMemory.heapUsed - startMemory.heapUsed,
        rss: endMemory.rss - startMemory.rss
      }
    };

    monitor.emit('request', data);
    logger.info('Request monitored', data);
  });

  next();
};

module.exports = monitorMiddleware;