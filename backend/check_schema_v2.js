
const { pool } = require('./src/config/db');

async function check() {
    try {
        const result = await pool.query("SELECT table_schema, table_name, column_name FROM information_schema.columns WHERE table_name = 'users'");
        console.table(result.rows);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
