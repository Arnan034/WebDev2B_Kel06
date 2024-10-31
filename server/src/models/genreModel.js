const pool = require('../config/db');

class Genre {
    static async getAll(){
        const allGenre = await pool.query('SELECT * FROM genre ORDER BY id_genre DESC');
        return allGenre.rows;
    }   

    static async create(genre){
        const createGenre = await pool.query(
            'INSERT INTO genre (genre) VALUES ($1) RETURNING *', 
            [genre]
        );
        return createGenre.rows[0];

    }

    static async update(id, name){
        const updateGenre = await pool.query(
            'UPDATE genre SET genre = $1 WHERE id_genre = $2 RETURNING *',
            [name, id]
        );
        return updateGenre.rows[0];
    }

    static async delete(id_genre){
        const deleteGenre = await pool.query(
            'DELETE FROM genre WHERE id_genre = $1 RETURNING *',
            [id_genre]
        );
        // console.log("Delete Query Result:", deleteGenre.rows[0]); // Debugging
        return deleteGenre.rows[0];
    }

    static async check(param) {
        let query, values;
    
        if (isNaN(param)) {
            // Jika param adalah string (genre)
            query = 'SELECT * FROM genre WHERE genre = $1';
            values = [param];
        } else {
            // Jika param adalah angka (id_genre)
            query = 'SELECT * FROM genre WHERE id_genre = $1';
            values = [parseInt(param, 10)];
        }
    
        const check = await pool.query(query, values);
        return check.rows[0];
    }
}

module.exports = Genre;