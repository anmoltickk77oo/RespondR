const { pool } = require('../config/db');
const logger = require('../utils/logger');

/**
 * Record an action in the incident audit trail
 * @param {number} incidentId - The ID of the incident
 * @param {string} action - Description of the action (e.g., 'TRIGGERED', 'ACKNOWLEDGED')
 * @param {number|null} performedBy - User ID who performed the action
 * @param {object} details - Additional metadata (e.g., { previousStatus: 'pending' })
 */
const logIncidentEvent = async (incidentId, action, performedBy = null, details = {}) => {
    try {
        await pool.query(
            `INSERT INTO incident_logs (incident_id, action, performed_by, details) 
             VALUES ($1, $2, $3, $4)`,
            [incidentId, action, performedBy, JSON.stringify(details)]
        );
        logger.info(`Audit Log: Incident ${incidentId} - ${action}`);
    } catch (error) {
        logger.error(`Failed to create audit log for incident ${incidentId}: %o`, error);
    }
};

const getIncidentTimeline = async (incidentId) => {
    try {
        const result = await pool.query(
            `SELECT l.*, u.name as user_name 
             FROM incident_logs l 
             LEFT JOIN users u ON l.performed_by = u.id 
             WHERE l.incident_id = $1 
             ORDER BY l.timestamp ASC`,
            [incidentId]
        );
        return result.rows;
    } catch (error) {
        logger.error(`Failed to fetch timeline for incident ${incidentId}: %o`, error);
        throw error;
    }
};

module.exports = { logIncidentEvent, getIncidentTimeline };
