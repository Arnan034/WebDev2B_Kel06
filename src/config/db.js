const { Pool } = require('pg');
const dotenv = require('dotenv');

// Memuat file .env
dotenv.config();

if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set in .env file!');
    process.exit(1);
}


let instance = null;

const createPool = () => {
    if (!instance) {
        instance = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false,
            },
        });
    }
    return instance;
};

module.exports = createPool();
