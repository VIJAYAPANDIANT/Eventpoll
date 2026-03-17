const { Pool } = require('pg');
require('dotenv').config();

const isLocal = process.env.DATABASE_URL.includes("localhost");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isLocal ? false : { rejectUnauthorized: false }
});

async function checkTables() {
    try {
        const client = await pool.connect();
        console.log('Connected to database.');
        
        const res = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        
        console.log('Tables found:', res.rows.map(r => r.table_name));
        
        if (res.rows.length === 0) {
            console.log('No tables found. Need to run schema.sql');
        } else {
            const users = await client.query('SELECT COUNT(*) FROM users');
            console.log('Total users:', users.rows[0].count);
        }
        
        client.release();
    } catch (err) {
        console.error('Error checking tables:', err.message);
    } finally {
        await pool.end();
    }
}

checkTables();
