const { pool } = require('../config/db');

// Insert a new user into the database
const createUser = async (name, email, hashedPassword, role = 'user', team = null) => {
    const result = await pool.query(
        'INSERT INTO users (name, email, password, role, team) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, team',
        [name, email, hashedPassword, role, team]
    );
    return result.rows[0];
};

// Find a user by their email
const getUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

// Get all responders (staff and admins)
const getResponders = async () => {
    const result = await pool.query(
        'SELECT id, name, email, role, team, created_at FROM users WHERE role IN (\'staff\', \'admin\') ORDER BY name ASC'
    );
    return result.rows;
};

module.exports = { createUser, getUserByEmail, getResponders };