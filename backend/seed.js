const { pool } = require('./src/config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seed() {
  console.log('🌱 Seeding Refined Roles...');
  try {
    const password = await bcrypt.hash('pass123', 10);

    const users = [
      { name: 'Global Admin', email: 'admin@respondr.io', role: 'admin', team: null },
      { name: 'Dr. Smith', email: 'medical@respondr.io', role: 'staff', team: 'medical' },
      { name: 'Chief Fire', email: 'fire@respondr.io', role: 'staff', team: 'fire' },
      { name: 'Officer Security', email: 'security@respondr.io', role: 'staff', team: 'security' },
      { name: 'Fixer Maintenance', email: 'maintenance@respondr.io', role: 'staff', team: 'maintenance' },
      { name: 'Regular Joe', email: 'user@respondr.io', role: 'user', team: null }
    ];

    for (const u of users) {
      await pool.query(`
        INSERT INTO users (name, email, password, role, team) 
        VALUES ($1, $2, $3, $4, $5) 
        ON CONFLICT (email) DO UPDATE 
        SET role = EXCLUDED.role, team = EXCLUDED.team
      `, [u.name, u.email, password, u.role, u.team]);
      console.log(`✅ User created/updated: ${u.email} (${u.role}${u.team ? ' - ' + u.team : ''})`);
    }

    console.log('✨ All specialized roles seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
