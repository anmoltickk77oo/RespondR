
const { pool } = require('./src/config/db');

async function migrate() {
    try {
        console.log('Starting migration...');
        
        // Check if team column exists
        const checkColumn = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='users' AND column_name='team';
        `);

        if (checkColumn.rows.length === 0) {
            console.log('Adding team column to users table...');
            await pool.query('ALTER TABLE users ADD COLUMN team VARCHAR(50);');
            console.log('Team column added successfully.');
        } else {
            console.log('Team column already exists.');
        }

        console.log('Migration complete.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
