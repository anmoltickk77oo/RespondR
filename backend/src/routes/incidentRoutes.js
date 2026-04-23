const express = require('express');
const router = express.Router();

// Placeholder for Incident routes
router.get('/', (req, res) => {
    res.json({ message: 'Incident endpoint ready' });
});

module.exports = router;
