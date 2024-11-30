const HealthChecker = require('../../utils/monitoring/health.utils');

const healthCheck = async (req, res) => {
  const checks = await Promise.all([
    HealthChecker.checkDatabase(),
    HealthChecker.checkMemory(),
    HealthChecker.checkDiskSpace()
  ]);

  const [database, memory, disk] = checks;
  const isHealthy = checks.every(check => check.status === 'up');

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date(),
    checks: {
      database,
      memory,
      disk
    }
  });
};

module.exports = healthCheck;