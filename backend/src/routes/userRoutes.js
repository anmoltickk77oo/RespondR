const express = require('express');
const { getAllResponders } = require('../controllers/userController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/users/responders -> fetch all staff and admin users
// Restricted to admin only
router.get('/responders', verifyToken, verifyRole(['admin']), getAllResponders);

module.exports = router;
