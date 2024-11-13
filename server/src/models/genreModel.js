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

    static async delete(client, id_genre){
        const deleteGenre = await client.query(
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

    static async addGenreFilm(client, id_genre, film_id) {
        try {
            const addGenre = await client.query(
                `INSERT INTO genre_film (id_film, id_genre) VALUES ($1, $2) RETURNING *`,
                [film_id, id_genre]
            );
            return addGenre.rows[0]; // Return the inserted row
        } catch (error) {
            console.error('Error adding genre to film:', error);
            throw new Error('Failed to add genre to film');
        }
    }

    // static async addGenreFilm(id_genre, film_id){
    //     const addGenre = await pool.query(`INSERT INTO genre_film (id_film, id_genre) VALUES ($1, $2) RETURNING *`, [film_id, id_genre]);
    //     return addGenre.rows[0];
    // }

    static async deleteGenreFilm(client, id){
        await client.query('DELETE FROM genre_film WHERE id_film = $1;', [id]);
    }

    static async deleteGenre(client, id){
        await client.query('DELETE FROM genre_film WHERE id_genre = $1;', [id]);
    }
}

module.exports = Genre;