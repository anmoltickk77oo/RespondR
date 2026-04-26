const { createIncident } = require('../models/incidentModel');
const { getIo } = require('../sockets/index');
const { sendSMSAlert } = require('../services/smsService');
const { sendEmailAlert } = require('../services/emailService');

const triggerSOS = async (req, res) => {
  try {
    // req.user.id comes from our authMiddleware!
    const userId = req.user.id;
    const { location, incidentType } = req.body;

    // 1. Basic validation
    if (!location || !incidentType) {
      return res.status(400).json({ message: 'Location and incident type are required.' });
    }

    // 2. Save the emergency to PostgreSQL
    const newIncident = await createIncident(userId, location, incidentType);

    // 3. The Magic: Blast the real-time event to all staff dashboards
    const io = getIo();
    io.emit('NEW_INCIDENT', newIncident);

    // 4. Extra Layer: Send Alerts (Async, don't block the response)
    sendSMSAlert(newIncident).catch(err => console.error('SMS Service Error:', err));
    sendEmailAlert(newIncident).catch(err => console.error('Email Service Error:', err));

    // 5. Send success back to the user who pressed the button
    res.status(201).json({
      message: 'SOS triggered successfully. Help is on the way.',
      incident: newIncident
    });

  } catch (error) {
    console.error('Error triggering SOS:', error);
    res.status(500).json({ message: 'Server error triggering SOS' });
  }
};

module.exports = { triggerSOS };