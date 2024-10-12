const pool = require('../config/db');

class Award {
    static async getAll(){
        const allGenre = await pool.query('SELECT * FROM award ORDER BY name ASC');
        return allGenre.rows;
    }

    static async getName(){
        const allGenre = await pool.query('SELECT DISTINCT aw.name FROM award AS aw ORDER BY aw.name ASC');
        return allGenre.rows;
    }

    static async create(name){
        const createGenre = await pool.query('');
        return createGenre.rows[0];

    }

    static async update(id, name){
        const updateGenre = await pool.query('');
        return updateGenre.rows[0];
    }

    static async delete(id){
        const deleteGenre = await pool.query('');
        return deleteGenre.rows[0];
    }

    static async check(name){
        const check = await pool.query('SELECT * FROM genre WHERE  = $1', [name]);
        return check.rows[0];
    }
}

module.exports = Award;