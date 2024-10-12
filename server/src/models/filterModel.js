const pool = require('../config/db');

class Filter {
    static async getYears() {
        const query = `
            SELECT DISTINCT fs.year AS year_film
            FROM film_show AS fs
            ORDER BY fs.year DESC
        `;
        const result = await pool.query(query);

        return result.rows; // Mengakses rows sebagai properti
    }

    static async getAvailabilitys() {
        const query = `
            SELECT DISTINCT fs.availability AS availability
            FROM film_show AS fs
            ORDER BY availability ASC
        `;
        const result = await pool.query(query);

        return result.rows;
    }
}

module.exports = Filter;
