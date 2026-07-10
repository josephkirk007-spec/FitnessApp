const Plan = require('../models/Plan');
const Client = require('../models/Client');

// Create/save a manual plan 
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

// Generate a basic AI-style plan 
const generatePlan = async (req, res) => {
  try {
    const { clientId } = req.body;

    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const workoutPlan = `Workout plan for ${client.name}
    
    Goal: ${client.goal}
    Fitness Level: ${client.fitnessLevel}
    Workout Days: ${client.workoutDays}
    Equipment: ${client.equipment}
    
    Weekly Plan:
     Day 1: Upper Body Strength
     Day 2: Lower Body Strength
     Day 3: Cardio and Core
     Day 4: Full Body Workout
    
    Advice: Focus on proper form, progressive overload, recovery, and consistency.
    `;

    const dietPlan = `Diet plan for ${client.name}
    Diet Preference: ${client.dietPreference}
    Food Restrictions: ${client.foodRestrictions}

    Meal Plan:
    Breakfast: High-Protein meal with complex carbs
    Lunch: Lean Protein with vegetables and whole grains
    Dinner: Protein-rich meal with healthy fats and vegetables
    Snacks: Fruits, nuts, and protein shakes

    Advice: Stay hydrated, avoid processed foods, and maintain a balanced diet.
    `;

    const plan = await Plan.create({
      coach: req.user.id,
      client: client._id,
      workoutPlan,
      dietPlan
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all plans
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
  generatePlan,
  getPlans
};