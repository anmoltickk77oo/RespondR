const express = require('express');
const { getAllIncidents, updateIncident } = require('../controllers/incidentController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/incidents -> fetch all incidents
router.get('/', verifyToken, getAllIncidents);

// PATCH /api/incidents/:id -> update incident status
router.patch('/:id', verifyToken, updateIncident);

module.exports = router;

