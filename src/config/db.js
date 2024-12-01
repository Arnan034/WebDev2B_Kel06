const { Pool } = require('pg');
const dotenv = require('dotenv');

// Memuat file .env
dotenv.config();

if (!process.env.DB_URL) {
    console.error('DATABASE_URL is not set in .env file!');
    process.exit(1);
}

let instance = null;

const createPool = () => {
    if (!instance) {
        instance = new Pool({
            connectionString: process.env.DB_URL,
            ssl: {
                rejectUnauthorized: false,
            },
        });
    }
    return instance;
};

module.exports = createPool();
