const pool = require('../../config/db');
const { cmsLogger } = require('../maintainability/logger.utils');
const checkDiskSpace = require('check-disk-space').default;

class HealthChecker {
    static async checkDatabase() {
        try {
          const client = await pool.connect();
          await client.query('SELECT 1');
          client.release();
          return { status: 'up', message: 'Database connection successful' };
        } catch (error) {
          cmsLogger.error('Database connection failed:', error.message);
          return { status: 'down', message: 'Database connection failed' };
        }
    }

    static async checkMemory() {
        const used = process.memoryUsage();
        const memoryUsage = {
          rss: `${Math.round(used.rss / 1024 / 1024)} MB`,
          heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)} MB`,
          heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)} MB`
        };
        
        return {
          status: 'up',
          memoryUsage
        };
    }

    static async checkDiskSpace() {
        try {
            const path = process.platform === 'win32' ? 'C:/' : '/';
            const diskSpace = await checkDiskSpace(path);
            
            return {
                status: 'up',
                diskSpace: {
                    free: `${Math.round(diskSpace.free / 1024 / 1024 / 1024)} GB`,
                    total: `${Math.round(diskSpace.size / 1024 / 1024 / 1024)} GB`
                }
            };
        } catch (error) {
            cmsLogger.error('Disk space check error:', error.message);
            return { status: 'error', message: 'Failed to check disk space' };
        }
    }
}

module.exports = HealthChecker;