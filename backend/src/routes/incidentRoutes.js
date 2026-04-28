const express = require('express');
const { getAllIncidents, updateIncident, getTimeline } = require('../controllers/incidentController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/incidents -> fetch all incidents
router.get('/', verifyToken, getAllIncidents);

// GET /api/incidents/:id/timeline -> fetch incident audit trail
router.get('/:id/timeline', verifyToken, getTimeline);

// PATCH /api/incidents/:id -> update incident status
router.patch('/:id', verifyToken, updateIncident);

module.exports = router;

