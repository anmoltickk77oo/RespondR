const db = require('../config/db');

class IncidentRepo {
  async create(userId, type, location, description) {
    const result = await db.query(
      `INSERT INTO incidents (user_id, type, location, description, status) 
       VALUES ($1, $2, $3, $4, 'pending') 
       RETURNING *`,
      [userId, type, location, description]
    );
    return result.rows[0];
  }

  async getAll() {
    const result = await db.query(
      `SELECT i.*, u.name as user_name 
       FROM incidents i 
       LEFT JOIN users u ON i.user_id = u.id 
       ORDER BY i.created_at DESC`
    );
    return result.rows[0];
  }

  async updateStatus(id, status) {
    const result = await db.query(
      `UPDATE incidents SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return result.rows[0];
  }
}

module.exports = new IncidentRepo();
