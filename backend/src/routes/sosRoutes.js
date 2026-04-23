const express = require('express');
const { triggerSOS, getAllIncidents, updateIncident } = require('../controllers/sosController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/sos -> verify user is logged in -> trigger the SOS logic
router.post('/', verifyToken, triggerSOS);

// GET /api/sos -> fetch all incidents
router.get('/', verifyToken, getAllIncidents);

// PATCH /api/sos/:id -> update incident status
router.patch('/:id', verifyToken, updateIncident);

module.exports = router;