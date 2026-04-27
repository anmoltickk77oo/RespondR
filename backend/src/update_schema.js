const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function updateSchema() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Add team column to users table if it doesn't exist
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS team VARCHAR(50)
    `);
    console.log('✅ Schema updated: Added team column to users table');
    
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating schema:', error);
    if (client) await client.end();
    process.exit(1);
  }
}

updateSchema();
