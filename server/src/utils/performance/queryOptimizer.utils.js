//server/src/utils/performance/queryOptimizer.utils.js
const { queryLogger } = require('../maintainability/logger.utils');
class QueryOptimizer {
  static async executeQuery(client, query, params = [], nameQuery = 'unknown') {
    try {
      // Add query execution time measurement
      const start = process.hrtime();
      const result = await client.query(query, params);
      const duration = process.hrtime(start);

      // Log slow queries (more than 1.5 second)
      if (duration[0] >= 1) {
        queryLogger.info(`Slow query detected (${duration[0]}s): ${query}`);
      }

      return result.rows;
    } catch (error) {
      queryLogger.error('Error executing query:', {
        query: nameQuery,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
}

module.exports = QueryOptimizer;