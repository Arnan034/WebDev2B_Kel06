// Path: src/models/authModel.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');

const saltRounds = 10;

class AuthModel {
    static async createUser(username, email, hashedPassword, pictureBuffer) {
        const result = await pool.query(
            'INSERT INTO "user" (username, password, email, role, picture) VALUES ($1, $2, $3, $4, $5) RETURNING *', // Ubah dari users menjadi user
            [username, hashedPassword, email, "user", pictureBuffer]
        );
        return result.rows[0];
    }

    static async getUserByUsernameOrEmail(username) {
        const result = await pool.query('SELECT * FROM "user" WHERE username = $1 OR email = $1' , [username]);
        return result.rows[0];
    }
}

module.exports = AuthModel;
