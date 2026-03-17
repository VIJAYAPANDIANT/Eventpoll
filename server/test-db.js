const { Pool } = require('pg');
require('dotenv').config();

const isLocal = process.env.DATABASE_URL.includes("localhost");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isLocal ? false : { rejectUnauthorized: false }
});

async function test() {
    try {
        const client = await pool.connect();
        console.log('Database Connection: SUCCESS');
        const res = await client.query('SELECT current_database(), current_user');
        console.log('User/DB:', res.rows[0]);
        client.release();
    } catch (err) {
        console.error('Database Connection: FAILED', err.message);
    } finally {
        await pool.end();
    }
}

test();
