// Path: src/models/authModel.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');

class AuthModel {
    static async createUser(username, email, hashedPassword, pictureBuffer) {
        const result = await pool.query(
            'INSERT INTO "user" (username, password, email, role, picture, status, created_at, is_verified) VALUES ($1, $2, $3, $4, $5, $6, NOW(), $6) RETURNING *', // Ubah dari users menjadi user
            [username, hashedPassword, email, "user", pictureBuffer, "false"]
        );
        return result.rows[0];
    }

    static async userVerified(id){
        await pool.query(`UPDATE "user" SET status = true, is_verified = true WHERE id_user = $1`, [id]);
    }

    static async getUserByUsernameOrEmail(username) {
        const result = await pool.query('SELECT * FROM "user" WHERE username = $1 OR email = $1' , [username]);
        return result.rows[0];
    }

    static async getUserIdGoogle(googleUser) {
        const result = await pool.query('SELECT * FROM "user" WHERE id_google = $1', [googleUser]);
        return result;
    }

    static async createGoogleAuth(username, email, id, picture){
        const result = await pool.query(`INSERT INTO "user" (username, email, id_google, role, picture, status, is_verified) VALUES ($1, $2, $3, 'user', $4, 'true', 'true')`, [username, email, id, picture]);
        return result.rows[0]
    }

    static async getMonitor(filter) {
        let query = `SELECT id_user as id, username as user, email as em, status as st FROM "user" WHERE role != 'admin'`;
        let values = [];
    
        if (filter) {
            query += ` AND status = $1`;
            values.push(filter);
        }
    
        const result = await pool.query(query, values);
        return result.rows;
    }

    static async updateStatus(id, status) {
        await pool.query(`UPDATE "user" SET status = $2 WHERE id_user = $1;`, [id, status]);
    }

    static async checkEmail(email) {
        const result = await pool.query(`SELECT email, is_verified FROM "user" WHERE email = $1;`, [email]);
        return result.rows[0];
    }

    static async checkUsername(username) {
        const result = await pool.query(`SELECT username FROM "user" WHERE username = $1 AND is_verified = true;`, [username]);
        return result.rows[0];
    }

    static async changePassword(email, newPassword) {
        const result = await pool.query(`UPDATE "user" SET password = $2 WHERE email = $1;`, [email, newPassword]);
        return result.rows[0];
    }

    static async deleteUnverifiedUser(email) {
        await pool.query(`DELETE FROM "user" WHERE email = $1;`, [email]);
    }
}

module.exports = AuthModel;
