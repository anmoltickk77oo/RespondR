
const { Pool } = require('pg');
require('dotenv').config();

async function check() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL.replace(/\/respondr_db$/, '/postgres')
    });
    try {
        const result = await pool.query("SELECT datname FROM pg_database WHERE datistemplate = false;");
        console.table(result.rows);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
