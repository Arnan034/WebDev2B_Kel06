//server/src/models/comment.model.js
const pool = require('../config/db');
const QueryOptimizer = require('../utils/performance/queryOptimizer.utils');
const {convertBufferToBase64} = require('../utils/security/image.utils');

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
    
        const result = await QueryOptimizer.executeQuery(pool, query, [], 'findAll');
        return result;
    }

    static async findByIdFilm(id_film, filter) {
        let query = `
            SELECT 
                *
            FROM comment_show
            WHERE id_film = $1`;
        let values = [id_film];
    
        // Append filter condition if filter is provided
        if (filter && filter !== 'all') { // Ensure we check for 'all' as a valid value
            query += ` AND rate = $2`; // Correct concatenation operator
            values.push(parseInt(filter, 10)); // Parse filter to integer if it’s a rating
        }
    
        const result = await QueryOptimizer.executeQuery(pool, query, values, 'findByIdFilm');
        return result.map(comment => ({
            id_film: comment.id_film,
            comment: comment.comment,
            rating: comment.rate,
            date: comment.date,
            user: comment.username,
            picture: comment.picture ? convertBufferToBase64(comment.picture) : null
        }));
    }

    static async create(id_user, id_film, rating, review){
        const query = `INSERT INTO comment (id_user, id_film, comment, rate, date, posted) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, false);`;
        const result = await QueryOptimizer.executeQuery(pool, query, [id_user, id_film, review, rating], 'createComment');
    }

    static async approveComment(id){
        const query = `UPDATE comment set posted = true WHERE id_comment = $1;`;
        const result = await QueryOptimizer.executeQuery(pool, query, [id], 'approveComment');
    }

    static async deleteComment(id){
        const query = `DELETE FROM comment WHERE id_comment = $1;`;
        const result = await QueryOptimizer.executeQuery(pool, query, [id], 'deleteComment');
    }

    static async deleteCommentFilm(client, id){
        const query = `DELETE FROM comment WHERE id_film = $1;`;
        const result = await QueryOptimizer.executeQuery(client, query, [id], 'deleteCommentFilm');
    }
}

module.exports = Comment;