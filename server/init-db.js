const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const isLocal = process.env.DATABASE_URL.includes("localhost");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isLocal ? false : { rejectUnauthorized: false }
});

async function initDB() {
    console.log(`Connecting to: ${process.env.DATABASE_URL.split('@')[1]}`);
    try {
        const client = await pool.connect();
        const schemaPath = path.join(__dirname, 'schema.sql');
        const sql = fs.readFileSync(schemaPath, 'utf8');
        
        console.log('Running schema.sql...');
        await client.query(sql);
        console.log('✅ Success! All database tables have been created.');
        
        client.release();
    } catch (err) {
        console.error('❌ Database Initialization Failed:');
        console.error(err.message);
    } finally {
        await pool.end();
    }
}

initDB();
