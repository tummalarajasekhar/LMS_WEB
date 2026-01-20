// lib/db.js
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Add this object below for Neon/Cloud support
    ssl: {
        rejectUnauthorized: false,
    },
});

export default pool;