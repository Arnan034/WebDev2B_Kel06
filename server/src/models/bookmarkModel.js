const pool = require('../config/db');

class Bookmark {
    static async getBookmark(userId){
        const result = await pool.query(`SELECT f.id_film AS id, f.title, f.picture, f.year, f.status, f.rate, f.views, f.date_upload, ARRAY_AGG(DISTINCT g.genre) AS genres
            FROM film_show as f
            LEFT JOIN genre_film gf ON f.id_film = gf.id_film
            LEFT JOIN genre g ON gf.id_genre = g.id_genre
            RIGHT JOIN bookmark b ON b.id_film = f.id_film
            WHERE b.id_user = $1
            GROUP BY f.id_film, f.title, f.picture, f.year, f.status, f.rate, f.views, f.date_upload, b.date 
            ORDER BY b.date DESC;` , [userId]);

        return result.rows.map(movie => ({
            id: movie.id,
            title: movie.title,
            picture: movie.picture ? movie.picture.toString('base64') : null,
            year: movie.year,
            status: movie.status,
            rate: movie.rate,
            genres: movie.genres,
            date: movie.date_upload
        }))
    }

    static async getUserBookmark(userId, filmId){
        const result = await pool.query('SELECT * FROM bookmark WHERE id_user = $1 AND id_film = $2' , [userId, filmId]);
        return result.rows[0];
    }

    static async addBookmark(userId, filmId) {
        const result = await pool.query(
            'INSERT INTO bookmark (id_user, id_film, date) VALUES ($1, $2, CURRENT_TIMESTAMP ) RETURNING *;',
            [userId, filmId]
        );
        return result.rows[0]; // Mengembalikan baris yang baru dimasukkan jika diperlukan
    }
    

    static async delBookmark(userId, filmId) {
        const result = await pool.query('DELETE FROM bookmark WHERE id_user = $1 AND id_film = $2;', [userId, filmId]);
        if (result.rowCount > 0) {
            return { message: 'Bookmark deleted successfully' };
        } else {
            throw new Error('Bookmark not found or could not be deleted');
        }
    }
    
    
}

module.exports = Bookmark;