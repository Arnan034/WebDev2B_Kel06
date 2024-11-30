// src/config/db.js
const { Pool } = require('pg');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Tambahkan logging untuk debug
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_DATABASE
};

console.log('Database connection config:', {
    ...config,
    password: '****' // Hide password in logs
});

const pool = new Pool(config);

// Add error handler
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

// Add connection test
pool.on('connect', () => {
    console.log('Connected to database successfully');
});

module.exports = pool;
