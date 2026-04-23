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

// Fetch all active/pending incidents, newest first
const getIncidents = async () => {
    const result = await pool.query(
        `SELECT * FROM incidents ORDER BY id DESC`
    );
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