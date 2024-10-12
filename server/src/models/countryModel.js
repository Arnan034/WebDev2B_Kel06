const pool = require('../config/db');

class Country {
    static async getAll () {
        const allCountry = await pool.query('SELECT * FROM country');
        return allCountry.rows;
    }

    static async create (name) {
        const createCountry = await pool.query('INSERT INTO country (country_name) VALUES ($1) RETURNING *', [name]);
        return createCountry.rows[0];
    }

    static async update (id, name){
        const updateCountry = await pool.query('UPDATE country SET');
        return updateCountry.rows[0];
    }

    static async delete (name) {
        const deleteCountry = await pool.query('DELETE FROM country');
        return deleteCountry.rows[0];
    }

    static async check(name){
        const check = await pool.query('SELECT * FROM country WHERE name = $1 OR id = $1', [name]);
        return check.rows[0];
    }
}

module.exports = Country;