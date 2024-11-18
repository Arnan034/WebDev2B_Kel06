//server/src
const pool = require('../config/db');
const QueryOptimizer = require('../utils/performance/queryOptimizer.utils');

class Filter {
    static async getYears() {
        const query = `
            SELECT DISTINCT fs.year AS year_film
            FROM film_show AS fs
            ORDER BY fs.year DESC
        `;
        const result = await QueryOptimizer.executeQuery(pool, query, [], 'getYears');

        return result; // Mengakses rows sebagai properti
    }

    static async getAvailabilitys() {
        const query = `
            SELECT DISTINCT fs.availability AS availability
            FROM film_show AS fs
            ORDER BY availability ASC
        `;
        const result = await QueryOptimizer.executeQuery(pool, query, [], 'getAvailabilitys');

        return result;
    }
}

module.exports = Filter;
