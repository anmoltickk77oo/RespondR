const { getIncidents, updateIncidentStatus } = require('../models/incidentModel');
const { getIo } = require('../sockets/index');

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

module.exports = { getAllIncidents, updateIncident };
