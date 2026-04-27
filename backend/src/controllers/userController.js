const { getResponders } = require('../models/userModel');

const getAllResponders = async (req, res) => {
  try {
    const responders = await getResponders();
    res.status(200).json({ 
      status: 'success',
      count: responders.length,
      responders 
    });
  } catch (error) {
    console.error('Error fetching responders:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Server error fetching responders' 
    });
  }
};

module.exports = { getAllResponders };
