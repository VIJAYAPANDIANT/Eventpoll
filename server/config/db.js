const { Pool } = require('pg');
require("dotenv").config();

const isLocal = process.env.DATABASE_URL.includes("localhost");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isLocal ? false : {
        rejectUnauthorized: false // Required for Neon
    }
});

module.exports = { pool };