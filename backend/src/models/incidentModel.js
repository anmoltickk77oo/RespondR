const { pool } = require('../config/db');

// Insert a new SOS incident into the database
const createIncident = async (userId, location, incidentType) => {
    const result = await pool.query(
        `INSERT INTO incidents (user_id, location, incident_type, status) 
         VALUES ($1, $2, $3, 'pending') 
         RETURNING *`,
        [userId, location, incidentType]
    );
    return result.rows[0];
};

// Fetch incidents with optional filters, newest first
const getIncidents = async (filters = {}) => {
    let query = `SELECT * FROM incidents`;
    let conditions = [];
    let values = [];

    if (filters.userId) {
        conditions.push(`user_id = $${values.length + 1}`);
        values.push(filters.userId);
    }

    if (filters.team) {
        // Mapping incident_type to team name using partial match
        // e.g. 'Medical Emergency' matches 'medical'
        conditions.push(`LOWER(incident_type) LIKE LOWER($${values.length + 1})`);
        values.push(`%${filters.team}%`);
    }

    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` ORDER BY id DESC`;

    const result = await pool.query(query, values);
    return result.rows;
};

// Update incident status (e.g., pending -> acknowledged)
const updateIncidentStatus = async (id, status) => {
    const result = await pool.query(
        `UPDATE incidents SET status = $1 WHERE id = $2 RETURNING *`,
        [status, id]
    );
    return result.rows[0];
};

module.exports = { createIncident, getIncidents, updateIncidentStatus };