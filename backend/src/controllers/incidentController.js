const { getIncidents, updateIncidentStatus } = require('../models/incidentModel');
const { getIo } = require('../sockets/index');
const { sendAcknowledgementEmail } = require('../services/emailService');
const logger = require('../utils/logger');

const getAllIncidents = async (req, res) => {
  try {
    const incidents = await getIncidents();
    res.status(200).json({ status: 'success', incidents });
  } catch (error) {
    logger.error('Error fetching incidents: %o', error);
    res.status(500).json({ status: 'error', message: 'Server error fetching incidents' });
  }
};

const updateIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ status: 'fail', message: 'Status is required to update.' });
    }

    const updatedIncident = await updateIncidentStatus(id, status);

    if (!updatedIncident) {
      return res.status(404).json({ status: 'fail', message: 'Incident not found' });
    }

    // 1. If acknowledged, send email to the user who triggered it
    if (status === 'acknowledged' && updatedIncident.user_email) {
        sendAcknowledgementEmail(updatedIncident).catch(err => 
            logger.error('Acknowledgement Email Error: %o', err)
        );
    }

    // 2. Blast the real-time event so dashboards update
    const io = getIo();
    io.emit('INCIDENT_UPDATED', updatedIncident);

    res.status(200).json({
      status: 'success',
      message: `Incident ${status} successfully`,
      incident: updatedIncident
    });
  } catch (error) {
    logger.error('Error updating incident: %o', error);
    res.status(500).json({ status: 'error', message: 'Server error updating incident' });
  }
};

module.exports = { getAllIncidents, updateIncident };
