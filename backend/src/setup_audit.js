const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function setupAuditTable() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Create incident_logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS incident_logs (
        id SERIAL PRIMARY KEY,
        incident_id INTEGER REFERENCES incidents(id) ON DELETE CASCADE,
        action VARCHAR(100) NOT NULL,
        performed_by INTEGER REFERENCES users(id),
        details JSONB,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Created incident_logs table for Evidence-Based Auditing');
    
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up audit table:', error);
    if (client) await client.end();
    process.exit(1);
  }
}

setupAuditTable();
