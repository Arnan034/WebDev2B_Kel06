const pool = require('../config/db');

class Comment {
    static async findAll() {
        const query = `
            SELECT 
                comment.id_comment AS comment_id,
                comment.comment,
                comment.rate,
                comment.date,
                "user".username,
                film.title AS film_title
            FROM comment
            JOIN "user" ON comment.id_user = "user".id_user
            JOIN film ON comment.id_film = film.id_film
            ORDER BY comment.date DESC
        `;

        const result = await pool.query(query);
        return result.rows.map(comment => ({
            id: comment.comment_id,
            username: comment.username,
            rate: comment.rate,
            filmTitle: comment.film_title,
            comment: comment.comment,
            date: comment.date
        }));
    }

    static async findByIdFilm(id) {
        const query = `
            SELECT 
                comment.id_comment AS comment_id,
                comment.comment,
                comment.rate,
                comment.date,
                "user".username,
                film.title AS film_title
            FROM comment
            JOIN "user" ON comment.id_user = "user".id_user
            JOIN film ON comment.id_film = film.id_film
            WHERE comment.id_film = $1
            ORDER BY comment.date DESC
        `;
        const result = await pool.query(query, [id]);
        return result.rows.map(comment => ({
            id: comment.comment_id,
            username: comment.username,
            rate: comment.rate,
            filmTitle: comment.film_title,
            comment: comment.comment,
            date: comment.date
        }));
    }
}

module.exports = Comment;
