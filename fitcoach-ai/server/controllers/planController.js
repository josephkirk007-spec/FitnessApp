const Plan = require('../models/Plan');
const Client = require('../models/Client');

// Create a new plan
const createPlan = async (req, res) => {
  try {
    const { clientId, workoutPlan, dietPlan } = req.body;

    if(!clientId || !workoutPlan || !dietPlan) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const plan = await Plan.create({
        coach: req.user.id, 
        client: clientId, 
        workoutPlan, 
        dietPlan
     });

     res.status(201).json({ message: 'Plan created successfully', plan });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all plans for a specific client
const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ coach: req.user.id }).populate('client');
    res.status(200).json({ plans });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createPlan,
  getPlans
};