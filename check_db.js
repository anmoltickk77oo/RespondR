const { pool } = require('./backend/src/config/db');

async function checkDb() {
  try {
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log("Tables in database:", res.rows.map(r => r.table_name).join(", "));

    // Check users
    if (res.rows.find(r => r.table_name === 'users')) {
      const usersRes = await pool.query('SELECT count(*) FROM users');
      console.log(`Users count: ${usersRes.rows[0].count}`);
    } else {
      console.log("❌ 'users' table missing.");
    }

    // Check incidents
    if (res.rows.find(r => r.table_name === 'incidents')) {
      const incidentsRes = await pool.query('SELECT count(*) FROM incidents');
      console.log(`Incidents count: ${incidentsRes.rows[0].count}`);
    } else {
      console.log("❌ 'incidents' table missing.");
    }
  } catch (e) {
    console.error("DB check failed", e);
  } finally {
    await pool.end();
  }
}

checkDb();
