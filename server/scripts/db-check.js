const { Pool } = require('pg');
const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false }
});

async function checkConnection() {
    console.log("Attempting to connect to database...");
    console.log("URL:", process.env.DATABASE_URL.replace(/:[^:]+@/, ':****@')); // Hide password
    
    try {
        const client = await pool.connect();
        console.log("✅ Success! Connection established.");
        
        const res = await client.query('SELECT current_database(), current_user');
        console.log("Database:", res.rows[0].current_database);
        console.log("User:", res.rows[0].current_user);
        
        client.release();
        process.exit(0);
    } catch (err) {
        console.error("❌ Failed to connect to the database.");
        console.error("Reason:", err.message);
        process.exit(1);
    }
}

checkConnection();
