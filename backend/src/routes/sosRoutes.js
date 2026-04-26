const express = require('express');
const { triggerSOS } = require('../controllers/sosController');
const { verifyToken } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateRequest');
const { sosSchema } = require('../validators/authValidator');

const router = express.Router();

/**
 * @openapi
 * /api/sos:
 *   post:
 *     summary: Trigger an SOS emergency alert
 *     tags: [Emergency]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [location, incidentType]
 *             properties:
 *               location: { type: string, example: "Main Lobby" }
 *               incidentType: { type: string, example: "Medical Emergency" }
 *               userDescription: { type: string, example: "Person collapsed, unconscious" }
 *     responses:
 *       201:
 *         description: SOS triggered successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', verifyToken, validate(sosSchema), triggerSOS);

module.exports = router;