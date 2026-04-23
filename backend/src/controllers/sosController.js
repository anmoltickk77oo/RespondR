const { createIncident, getIncidents, updateIncidentStatus } = require('../models/incidentModel');
const { getIo } = require('../sockets/index');

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

    // 4. Send success back to the user who pressed the button
    res.status(201).json({
      message: 'SOS triggered successfully. Help is on the way.',
      incident: newIncident
    });

  } catch (error) {
    console.error('Error triggering SOS:', error);
    res.status(500).json({ message: 'Server error triggering SOS' });
  }
};

const getAllIncidents = async (req, res) => {
  try {
    const incidents = await getIncidents();
    res.status(200).json({ incidents });
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({ message: 'Server error fetching incidents' });
  }
};

const updateIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required to update.' });
    }

    const updatedIncident = await updateIncidentStatus(id, status);

    if (!updatedIncident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    // Blast the real-time event so dashboards update
    const io = getIo();
    io.emit('INCIDENT_UPDATED', updatedIncident);

    res.status(200).json({
      message: 'Incident updated successfully',
      incident: updatedIncident
    });
  } catch (error) {
    console.error('Error updating incident:', error);
    res.status(500).json({ message: 'Server error updating incident' });
  }
};

module.exports = { triggerSOS, getAllIncidents, updateIncident };