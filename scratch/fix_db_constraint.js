require('dotenv').config({ path: '../backend/.env' });
const { pool } = require('../backend/src/config/db');

async function fixConstraint() {
  try {
    console.log('Attempting to update status constraint...');
    await pool.query(`
      ALTER TABLE incidents 
      DROP CONSTRAINT IF EXISTS incidents_status_check;
    `);

    await pool.query(`
      ALTER TABLE incidents 
      ADD CONSTRAINT incidents_status_check 
      CHECK (status IN ('pending', 'responding', 'resolved', 'acknowledged'));
    `);

    console.log('✅ Success! Database constraint updated to include "acknowledged".');
  } catch (err) {
    console.error('❌ Failed to update constraint:', err.message);
  } finally {
    await pool.end();
  }
}

fixConstraint();
