const metrics = {
    requests: {},
    slowRequests: [],
    errors: {}
  };
  
const recordMetric = (data) => {
    const { path, method, duration, statusCode } = data;
    const key = `${method}:${path}`;
  
    // Initialize metrics for this endpoint if not exists
    if (!metrics.requests[key]) {
      metrics.requests[key] = {
        count: 0,
        totalDuration: 0,
        avgDuration: 0,
        statusCodes: {}
      };
    }
  
    // Update metrics
    metrics.requests[key].count++;
    metrics.requests[key].totalDuration += duration;
    metrics.requests[key].avgDuration = 
    metrics.requests[key].totalDuration / metrics.requests[key].count;
  
    // Record status codes
    metrics.requests[key].statusCodes[statusCode] = 
      (metrics.requests[key].statusCodes[statusCode] || 0) + 1;
  
    // Record slow requests (> 1000ms)
    if (duration > 5000) {
      metrics.slowRequests.push({
        path,
        method,
        duration,
        timestamp: new Date()
      });
    }
};

const getMetrics = () => {
    return {
        ...metrics,
        timestamp: new Date(),
        uptime: process.uptime()
    };
};

module.exports = {
    recordMetric,
    getMetrics
};