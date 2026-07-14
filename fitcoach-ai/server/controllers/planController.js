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

    if (!clientId) {
      return res.status(400).json({
        message: "Client ID is required",
      });
    }

    const client = await Client.findOne({
      _id: clientId,
      coach: req.user._id,
    });

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    const workoutPlan = `
WORKOUT PLAN FOR ${client.name.toUpperCase()}

Goal: ${client.goal}
Fitness Level: ${client.fitnessLevel}
Days Per Week: ${client.workoutDays}
Equipment: ${client.equipment}

Weekly Schedule:
Day 1: Upper-body strength
- Bench press: 3 sets of 8-10 reps
- Seated row: 3 sets of 10 reps
- Shoulder press: 3 sets of 10 reps
- Biceps curls: 3 sets of 12 reps
- Triceps extensions: 3 sets of 12 reps

Day 2: Lower-body strength
- Squats: 3 sets of 8-10 reps
- Romanian deadlifts: 3 sets of 10 reps
- Lunges: 3 sets of 10 reps per leg
- Calf raises: 3 sets of 15 reps

Day 3: Cardio and core
- Moderate cardio: 20-30 minutes
- Plank: 3 rounds of 30-45 seconds
- Dead bugs: 3 sets of 10 reps per side
- Bicycle crunches: 3 sets of 15 reps

Remaining workout days:
Repeat the most relevant sessions based on the client's goal, with at least one rest day between repeated strength sessions.

General guidance:
Use controlled form, warm up before training, increase difficulty gradually, and stop if an exercise causes pain.
`;

    const dietPlan = `
DIET PLAN FOR ${client.name.toUpperCase()}

Diet Preference: ${client.dietPreference}
Food Restrictions: ${client.foodRestrictions || "None listed"}

Sample Daily Meal Plan:

Breakfast:
- Protein source
- Whole-grain or fruit carbohydrate
- Water

Lunch:
- Lean protein or preferred plant protein
- Vegetables
- Rice, potatoes, quinoa, or another suitable carbohydrate

Snack:
- Fruit, yogurt alternative, nuts, or a protein-rich snack that matches the client's restrictions

Dinner:
- Protein source
- Vegetables
- Healthy fats
- Moderate carbohydrate portion based on activity level

Hydration:
Drink water regularly throughout the day and increase fluids around exercise.

General guidance:
Use this as a general planning template. Adjust portions based on progress, appetite, activity, and guidance from a qualified professional when needed.
`;

    const plan = await Plan.create({
      coach: req.user._id,
      client: client._id,
      workoutPlan,
      dietPlan,
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get all plans
const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ 
      coach: req.user.id 
    })
    .populate("client", "name goal fitnessLevel dietPreference")
    .sort({ createdAt: -1 });

    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', error: error.message 
    });
  }
};

module.exports = {
  createPlan,
  generatePlan,
  getPlans
};