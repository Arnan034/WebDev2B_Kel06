// Path: src/models/authModel.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');

const saltRounds = 10;

class AuthModel {
    static async createUser(name, email, password) {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const result = await pool.query(
            'INSERT INTO "user" (name, email, password) VALUES ($1, $2, $3) RETURNING *', // Ubah dari users menjadi user
            [name, email, hashedPassword]
        );
        return result.rows[0];
    }

    static async getUserByUsernameOrEmail(username) {
        const result = await pool.query('SELECT * FROM "user" WHERE username = $1 OR email = $1' , [username]);
        return result.rows[0];
    }
}

module.exports = AuthModel;
