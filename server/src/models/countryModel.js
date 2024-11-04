const pool = require('../config/db');

class Country {
    static async getAll () {
        const allCountry = await pool.query('SELECT * FROM country ORDER BY id_country DESC');
        return allCountry.rows;
    }

    static async create(country_name) {
        const createCountry = await pool.query(
            'INSERT INTO country (country_name) VALUES ($1) RETURNING *', 
            [country_name]
        );
        return createCountry.rows[0];
    }

    static async update(id, name) {
        const updateCountry = await pool.query(
            'UPDATE country SET country_name = $1 WHERE id_country = $2 RETURNING *',
            [name, id]
        );
        return updateCountry.rows[0];
    }

    static async delete(id_country) {
        const deleteCountry = await pool.query(
            'DELETE FROM country WHERE id_country = $1 RETURNING *',
            [id_country]
        );
        return deleteCountry.rows[0];
    }

    static async check(param) {
        let query, values;
    
        if (isNaN(param)) {
            // Jika param adalah string (country_name)
            query = 'SELECT * FROM country WHERE country_name = $1';
            values = [param];
        } else {
            // Jika param adalah angka (id_country)
            query = 'SELECT * FROM country WHERE id_country = $1';
            values = [parseInt(param, 10)];
        }
    
        const check = await pool.query(query, values);
        return check.rows[0];
    }
}

module.exports = Country;