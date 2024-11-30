//server/src/models/bookmark.model.js
const pool = require('../config/db');
const QueryOptimizer = require('../utils/performance/queryOptimizer.utils');
const { convertBufferToBase64 } = require('../utils/security/image.utils');

class Bookmark {
    static async getBookmark(userId){
        const query = `
        SELECT f.id_film AS id, 
                f.title, 
                f.picture, 
                f.year, 
                f.status, 
                f.rate, 
                f.views, 
                f.date_upload, 
                ARRAY_AGG(DISTINCT g.genre) AS genres
            FROM film_show as f
            LEFT JOIN genre_film gf ON f.id_film = gf.id_film
            LEFT JOIN genre g ON gf.id_genre = g.id_genre
            RIGHT JOIN bookmark b ON b.id_film = f.id_film
            WHERE b.id_user = $1
            GROUP BY f.id_film, f.title, f.picture, f.year, f.status, f.rate, f.views, f.date_upload, b.date 
            ORDER BY b.date DESC;`;
        const result = await QueryOptimizer.executeQuery(pool, query, [userId], 'getBookmark');

        return result.map(movie => ({
            id: movie.id,
            title: movie.title,
            picture: movie.picture ? convertBufferToBase64(movie.picture) : null,
            year: movie.year,
            status: movie.status,
            rate: movie.rate,
            genres: movie.genres,
            date: movie.date_upload
        }))
    }

    static async getUserBookmark(userId, filmId){
        const query = 'SELECT * FROM bookmark WHERE id_user = $1 AND id_film = $2;';
        const result = await QueryOptimizer.executeQuery(pool, query, [userId, filmId], 'getUserBookmark');
        return result[0];
    }

    static async addBookmark(userId, filmId) {
        const query = 'INSERT INTO bookmark (id_user, id_film, date) VALUES ($1, $2, CURRENT_TIMESTAMP ) RETURNING *;';
        const result = await QueryOptimizer.executeQuery(pool, query, [userId, filmId], 'addBookmark');
    }
    

    static async delBookmark(userId, filmId) {
        const query = 'DELETE FROM bookmark WHERE id_user = $1 AND id_film = $2;';
        const result = await QueryOptimizer.executeQuery(pool, query, [userId, filmId], 'delBookmark');
        if (result) {
            return { message: 'Bookmark deleted successfully' };
        } else {
            throw new Error('Bookmark not found or could not be deleted');
        }
    }
    
    
}

module.exports = Bookmark;