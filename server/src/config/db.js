// src/config/db.js
const { Pool } = require('pg');
const path = require('path');
const dotenv = require('dotenv');

// Explicitly set path untuk .env server
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_DATABASE
});

module.exports = pool;
