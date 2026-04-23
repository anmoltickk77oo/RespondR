const db = require('../config/db');

class UserRepo {
  async findByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  async findById(id) {
    const result = await db.query('SELECT id, name, email, role FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  async create(name, email, hashedPassword, role = 'user') {
    const result = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, role]
    );
    return result.rows[0];
  }
}

module.exports = new UserRepo();
