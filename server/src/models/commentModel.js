const pool = require('../config/db');

class Comment {
    static async findAll(filter) {
        let query = `SELECT c.id_comment, 
                u.username, 
                f.title, 
                c.comment, 
                c.rate, 
                c.posted
            FROM comment as c
            LEFT JOIN film as f ON f.id_film = c.id_film
            LEFT JOIN "user" AS u ON u.id_user = c.id_user `;

        const validFilters = ['username', 'rate', 'title', 'comment', 'posted'];
        if (filter && validFilters.includes(filter)) {
            query += `ORDER BY ${filter} ASC;`;
        } else {
            query += `ORDER BY c.date DESC;`;
        }
    
        const result = await pool.query(query);
        return result.rows;
    }

    static async findByIdFilm(id, filter) {
        let query = `
            SELECT 
                *
            FROM comment_show
            WHERE id_film = $1`;
        let values = [id];
    
        // Append filter condition if filter is provided
        if (filter && filter !== 'all') { // Ensure we check for 'all' as a valid value
            query += ` AND rate = $2`; // Correct concatenation operator
            values.push(parseInt(filter, 10)); // Parse filter to integer if it’s a rating
        }
    
        const result = await pool.query(query, values);
        return result.rows.map(comment => ({
            id_film: comment.id_film,
            comment: comment.comment,
            rating: comment.rate,
            date: comment.date,
            user: comment.username,
            picture: comment.picture.toString('base64')
        }));
    }

    static async create(id_user, id_film, rating, review){
        await pool.query(`INSERT INTO comment (id_user, id_film, comment, rate, date, posted) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, false);`, [id_user, id_film, review, rating]);
    }

    static async approveComment(id){
        await pool.query(`UPDATE comment set posted = true WHERE id_comment = $1;`, [id]);
    }

    static async deleteComment(id){
        await pool.query(`DELETE FROM comment WHERE id_comment = $1;`, [id]);
    }

    static async deleteCommentFilm(client, id){
        await client.query(`DELETE FROM comment WHERE id_film = $1;`, [id]);
    }
}

module.exports = Comment;