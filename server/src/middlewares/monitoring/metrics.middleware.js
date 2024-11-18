const { httpRequestDuration, httpRequestTotal, activeConnections } = require('../../utils/monitoring/metrics.utils');

const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  // Increment active connections
  activeConnections.inc();

  // Record metrics when response is finished
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000; // Convert to seconds
    const route = req.route ? req.route.path : req.path;
    const labels = {
      method: req.method,
      route,
      status_code: res.statusCode
    };

    // Record request duration
    httpRequestDuration.observe(labels, duration);
    
    // Increment request counter
    httpRequestTotal.inc(labels);
    
    // Decrement active connections
    activeConnections.dec();
  });

  next();
};

module.exports = metricsMiddleware;