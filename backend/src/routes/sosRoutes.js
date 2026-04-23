const express = require('express');
const { triggerSOS } = require('../controllers/sosController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/sos -> verify user is logged in -> trigger the SOS logic
router.post('/', verifyToken, triggerSOS);

module.exports = router;