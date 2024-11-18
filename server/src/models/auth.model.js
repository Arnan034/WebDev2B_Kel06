// Path: src/models/authModel.js
const pool = require('../config/db');
const QueryOptimizer = require('../utils/performance/queryOptimizer.utils');

class AuthModel {
    static async createUser(username, email, hashedPassword, pictureBuffer) {
        const query = 'INSERT INTO "user" (username, password, email, role, picture, status, created_at, is_verified) VALUES ($1, $2, $3, $4, $5, $6, NOW(), $6) RETURNING *';
        const result = await QueryOptimizer.executeQuery(pool, query, [username, hashedPassword, email, "user", pictureBuffer, "false"], 'createUser');
        return result[0];
    }

    static async userVerified(id){
        const query = 'UPDATE "user" SET status = true, is_verified = true WHERE id_user = $1';
        const result = await QueryOptimizer.executeQuery(pool, query, [id], 'userVerified');
    }

    static async getUserByUsernameOrEmail(username) {
        const query = 'SELECT * FROM "user" WHERE username = $1 OR email = $1';
        const result = await QueryOptimizer.executeQuery(pool, query, [username], 'getUserByUsernameOrEmail');
        return result[0];
    }

    static async getUserIdGoogle(googleUser) {
        const query = 'SELECT * FROM "user" WHERE id_google = $1';
        const result = await QueryOptimizer.executeQuery(pool, query, [googleUser], 'getUserByIdGoogle');
        return result[0];
    }

    static async createGoogleAuth(username, email, id, picture){
        const query = 'INSERT INTO "user" (username, email, id_google, role, picture, status, is_verified) VALUES ($1, $2, $3, $4, $5, $6, $7)';
        const result = await QueryOptimizer.executeQuery(pool, query, [username, email, id, "user", picture, "true", "true"], 'createGoogleAuth');
        return result[0];
    }

    static async getMonitor(filter) {
        let query = `SELECT id_user as id, username as user, email as em, status as st FROM "user" WHERE role != 'admin'`;
        let values = [];
    
        if (filter) {
            query += ` AND status = $1`;
            values.push(filter);
        }
    
        const result = await QueryOptimizer.executeQuery(pool, query, values, 'getMonitorUser');
        return result;
    }

    static async updateStatus(id, status) {
        const query = 'UPDATE "user" SET status = $2 WHERE id_user = $1;';
        const result = await QueryOptimizer.executeQuery(pool, query, [id, status], 'updateStatus');
    }

    static async checkEmail(email) {
        const query = 'SELECT email, is_verified FROM "user" WHERE email = $1;';
        const result = await QueryOptimizer.executeQuery(pool, query, [email], 'checkEmail');
        return result[0];
    }

    static async checkUsername(username) {
        const query = 'SELECT username FROM "user" WHERE username = $1 AND is_verified = true;';
        const result = await QueryOptimizer.executeQuery(pool, query, [username], 'checkUsername');
        return result[0];
    }

    static async changePassword(email, newPassword) {
        const query = 'UPDATE "user" SET password = $2 WHERE email = $1;';
        const result = await QueryOptimizer.executeQuery(pool, query, [email, newPassword], 'changePassword');
        return result[0];
    }   

    static async deleteUnverifiedUser(email) {
        const query = 'DELETE FROM "user" WHERE email = $1;';
        const result = await QueryOptimizer.executeQuery(pool, query, [email], 'deleteUnverifiedUser');
    }
}

module.exports = AuthModel;
