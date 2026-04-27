const { pool } = require('./src/config/db');

async function fix() {
    try {
        console.log('Dropping old constraint...');
        await pool.query('ALTER TABLE incidents DROP CONSTRAINT IF EXISTS incidents_status_check');
        
        console.log('Adding new constraint with acknowledged...');
        await pool.query(`
            ALTER TABLE incidents 
            ADD CONSTRAINT incidents_status_check 
            CHECK (status IN ('pending', 'responding', 'resolved', 'acknowledged'))
        `);
        
        console.log('✅ Database constraint updated successfully!');
    } catch (err) {
        console.error('❌ Failed to update constraint:', err);
    } finally {
        process.exit(0);
    }
}

fix();
