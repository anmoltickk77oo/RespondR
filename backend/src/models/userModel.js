const { pool } = require('../config/db');

// Insert a new user into the database
const createUser = async (name, email, hashedPassword, role = 'user') => {
    const result = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
        [name, email, hashedPassword, role]
    );
    return result.rows[0];
};

// Find a user by their email
const getUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

module.exports = { createUser, getUserByEmail };