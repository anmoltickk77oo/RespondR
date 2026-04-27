const { pool } = require('./src/config/db');

async function check() {
    try {
        const res = await pool.query(`
            SELECT conname, pg_get_constraintdef(oid) 
            FROM pg_constraint 
            WHERE conrelid = 'incidents'::regclass 
            AND contype = 'c';
        `);
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
}

check();
