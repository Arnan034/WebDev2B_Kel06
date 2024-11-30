const EventEmitter = require('events');
const logger = require('../maintainability/logger.utils');

class MonitoringEmitter extends EventEmitter {}
const monitor = new MonitoringEmitter();

// Monitor system resources
const startResourceMonitoring = (interval = 60000) => { // Default 1 minute
  setInterval(() => {
    const usage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    monitor.emit('resources', {
      memory: {
        heapUsed: usage.heapUsed,
        heapTotal: usage.heapTotal,
        rss: usage.rss
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      }
    });
  }, interval);
};

// Monitor event handlers
monitor.on('resources', (data) => {
  logger.info('Resource usage', data);
});

monitor.on('error', (error) => {
  logger.error('Monitoring error', error);
});

module.exports = {
  monitor,
  startResourceMonitoring
};