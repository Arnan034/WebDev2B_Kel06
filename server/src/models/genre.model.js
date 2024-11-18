//server/src/models/genre.model.js
const pool = require('../config/db');
const QueryOptimizer = require('../utils/performance/queryOptimizer.utils');

class Genre {
    static async getAll(){
        const query = 'SELECT * FROM genre ORDER BY id_genre DESC';
        const result = await QueryOptimizer.executeQuery(pool, query, [], 'getAll');
        return result;
    }   

    static async create(genre){
        const query = 'INSERT INTO genre (genre) VALUES ($1) RETURNING *';
        const result = await QueryOptimizer.executeQuery(pool, query, [genre], 'createGenre');
        return result[0];
    }

    static async update(id, name){
        const query = 'UPDATE genre SET genre = $1 WHERE id_genre = $2 RETURNING *';
        const result = await QueryOptimizer.executeQuery(pool, query, [name, id], 'updateGenre');
        return result[0];
    }

    static async delete(client, id_genre){
        const query = 'DELETE FROM genre WHERE id_genre = $1 RETURNING *';
        const result = await QueryOptimizer.executeQuery(client, query, [id_genre], 'deleteGenre');
        return result[0];
    }

    static async check(param) {
        let query, values;
    
        if (isNaN(param)) {
            query = 'SELECT * FROM genre WHERE genre = $1';
            values = [param];
        } else {
            query = 'SELECT * FROM genre WHERE id_genre = $1';
            values = [parseInt(param, 10)];
        }
    
        const result = await QueryOptimizer.executeQuery(pool, query, values, 'check');
        return result[0];
    }

    static async addGenreFilm(client, id_genre, film_id) {
        try {
            const query = `INSERT INTO genre_film (id_film, id_genre) VALUES ($1, $2) RETURNING *`;
            const result = await QueryOptimizer.executeQuery(client, query, [film_id, id_genre], 'addGenreFilm');
            return result[0];
        } catch (error) {
            console.error('Error adding genre to film:', error);
            throw new Error('Failed to add genre to film');
        }
    }
    
    static async deleteGenreFilm(client, id){
        const query = 'DELETE FROM genre_film WHERE id_film = $1;';
        const result = await QueryOptimizer.executeQuery(client, query, [id], 'deleteGenreFilm');
    }

    static async deleteGenre(client, id){
        const query = 'DELETE FROM genre_film WHERE id_genre = $1;';
        const result = await QueryOptimizer.executeQuery(client, query, [id], 'deleteGenre');
    }
}

module.exports = Genre;