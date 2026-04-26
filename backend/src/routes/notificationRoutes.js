const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { pool } = require('../config/db');
const logger = require('../utils/logger');

const router = express.Router();

// POST /api/notifications/subscribe -> Save a user's push subscription
router.post('/subscribe', verifyToken, async (req, res) => {
  try {
    const { subscription } = req.body;
    const userId = req.user.id;

    if (!subscription) {
      return res.status(400).json({ status: 'fail', message: 'Subscription data is required' });
    }

    // Save to database (using the pool directly for now, as models aren't updated to Knex yet)
    await pool.query(
      'INSERT INTO subscriptions (user_id, subscription_data) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, JSON.stringify(subscription)]
    );

    res.status(201).json({ status: 'success', message: 'Subscribed to push notifications' });
  } catch (error) {
    logger.error('Subscription Error: %o', error);
    res.status(500).json({ status: 'error', message: 'Failed to subscribe' });
  }
});

module.exports = router;
