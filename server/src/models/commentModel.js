const pool = require('../config/db');

class Comment {
    static async findAll(){

    }

    static async findByIdFilm(id) {
        const query = `
            SELECT 
                *
            FROM comment_show
            WHERE id_film = $1
            `;
        const result = await pool.query(query, [id]);
        return result.rows.map(comment => ({
            id_film: comment.id_film,
            comment: comment.comment,
            rating: comment.rate,
            date: comment.date,
            user: comment.username,
            picture: comment.picture.toString('base64')
        }));
    }

}

module.exports = Comment;