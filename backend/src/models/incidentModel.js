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

module.exports = { createIncident };