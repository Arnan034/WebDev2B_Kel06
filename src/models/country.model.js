//server/src/models/country.model.js
const pool = require('../config/db');
const QueryOptimizer = require('../utils/performance/queryOptimizer.utils');

class Country {
    static async getAll () {
        const query = `SELECT 
                c.id_country, 
                c.country_name, 
                CASE 
                    WHEN COUNT(f.id_film) > 0 THEN TRUE
                    ELSE FALSE
                END AS have_film
            FROM 
                country c
            LEFT JOIN 
                film f 
            ON 
                c.id_country = f.id_country
            GROUP BY 
                c.id_country, c.country_name
            ORDER BY
                c.id_country DESC;`;
        const result = await QueryOptimizer.executeQuery(pool, query, [], 'getAll');
        return result;
    }

    static async create(country_name) {
        const query = 'INSERT INTO country (country_name) VALUES ($1) RETURNING *';
        const result = await QueryOptimizer.executeQuery(pool, query, [country_name], 'create');
        return result[0];
    }

    static async update(id, name) {
        const query = 'UPDATE country SET country_name = $1 WHERE id_country = $2 RETURNING *';
        const result = await QueryOptimizer.executeQuery(pool, query, [name, id], 'update');
        return result[0];
    }

    static async delete(id_country) {
        const query = 'DELETE FROM country WHERE id_country = $1 RETURNING *';
        const result = await QueryOptimizer.executeQuery(pool, query, [id_country], 'delete');
        return result[0];
    }

    static async check(param) {
        let query, values;
    
        if (isNaN(param)) {
            query = 'SELECT * FROM country WHERE LOWER(country_name) = LOWER($1)';
            values = [param];
        } else {
            query = 'SELECT * FROM country WHERE id_country = $1';
            values = [parseInt(param, 10)];
        }
    
        const result = await QueryOptimizer.executeQuery(pool, query, values, 'check');
        return result[0];
    }
}

module.exports = Country;