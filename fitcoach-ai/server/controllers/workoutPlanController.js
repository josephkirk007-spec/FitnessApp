const WorkoutPlan = require("../models/WorkoutPlan");
const Client = require("../models/Client");
const { generateWorkoutData } = require("../services/workoutService");


const getGoalExercise = (goal) => {
    const goalExercise = {
        "Lose body fat": "Cardio intervals: 15-20 minutes",
        "Gain muscle": "Add one accessory exercise: 3 sets of 10-12",
        "Improve strength": "Main strength movement: 4 sets of 5-8",
        "Improve endurance": "Steady cardio: 20-30 minutes",
        " General fitness": "Moderate cardio of mobility: 15 minutes",
    };

    return goalExercises[goal] || "Moderate cardio: 15 minutes";
};

// @desc    Create a workout plan
// @route   POST /api/v1/workouts
// @access  Private
const createWorkoutPlan = async (req, res) => {
  try {
    const {
      clientId,
      title,
      weeks,
      workoutDays,
      exercises,
      notes,
    } = req.body;

    if (!clientId || !title || !workoutDays || !exercises) {
      return res.status(400).json({
        message:
          "Client, title, workout days, and exercises are required",
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

    const workoutPlan = await WorkoutPlan.create({
      coach: req.user._id,
      client: client._id,
      title,
      weeks: Number(weeks) || 4,
      workoutDays: Number(workoutDays),
      exercises,
      notes: notes?.trim() || "",
    });

    return res.status(201).json(workoutPlan);
  } catch (error) {
    console.error("CREATE WORKOUT PLAN ERROR:", error);

    return res.status(500).json({
      message: error.message || "Unable to create workout plan",
    });
  }
};

// @desc    Get all workout plans for logged-in coach
// @route   GET /api/v1/workouts
// @access  Private
const getWorkoutPlans = async (req, res) => {
  try {
    const workoutPlans = await WorkoutPlan.find({
      coach: req.user._id,
    })
      .populate(
        "client",
        "name goal fitnessLevel workoutDays equipment"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json(workoutPlans);
  } catch (error) {
    console.error("GET WORKOUT PLANS ERROR:", error);

    return res.status(500).json({
      message: error.message || "Unable to retrieve workout plans",
    });
  }
};

// @desc    Get one workout plan
// @route   GET /api/v1/workouts/:id
// @access  Private
const getWorkoutPlanById = async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findOne({
      _id: req.params.id,
      coach: req.user._id,
    }).populate(
      "client",
      "name age goal fitnessLevel workoutDays equipment"
    );

    if (!workoutPlan) {
      return res.status(404).json({
        message: "Workout plan not found",
      });
    }

    return res.status(200).json(workoutPlan);
  } catch (error) {
    console.error("GET WORKOUT PLAN ERROR:", error);

    return res.status(500).json({
      message: error.message || "Unable to retrieve workout plan",
    });
  }
};

// @desc    Update a workout plan
// @route   PUT /api/v1/workouts/:id
// @access  Private
const updateWorkoutPlan = async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findOne({
      _id: req.params.id,
      coach: req.user._id,
    });

    if (!workoutPlan) {
      return res.status(404).json({
        message: "Workout plan not found",
      });
    }

    const updatedWorkoutPlan =
      await WorkoutPlan.findByIdAndUpdate(
        workoutPlan._id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    return res.status(200).json(updatedWorkoutPlan);
  } catch (error) {
    console.error("UPDATE WORKOUT PLAN ERROR:", error);

    return res.status(500).json({
      message: error.message || "Unable to update workout plan",
    });
  }
};

// @desc    Delete a workout plan
// @route   DELETE /api/v1/workouts/:id
// @access  Private
const deleteWorkoutPlan = async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findOne({
      _id: req.params.id,
      coach: req.user._id,
    });

    if (!workoutPlan) {
      return res.status(404).json({
        message: "Workout plan not found",
      });
    }

    await workoutPlan.deleteOne();

    return res.status(200).json({
      message: "Workout plan deleted successfully",
      id: workoutPlan._id,
    });
  } catch (error) {
    console.error("DELETE WORKOUT PLAN ERROR:", error);

    return res.status(500).json({
      message: error.message || "Unable to delete workout plan",
    });
  }
};

// @desc    Generate a workout plan from a client's profile
// @route   POST /api/v1/workouts/generate
// @access  Private
const generateWorkoutPlan = async (req, res) => {
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

    const generatedData = generateWorkoutData(client);

    const workoutPlan = await WorkoutPlan.create({
      coach: req.user._id,
      client: client._id,
      ...generatedData,
    });


    return res.status(201).json(workoutPlan);
  } catch (error) {
    console.error("GENERATE WORKOUT PLAN ERROR:", error);

    return res.status(500).json({
      message: error.message || "Unable to generate workout plan",
    });
  }
};

module.exports = {
  createWorkoutPlan,
  generateWorkoutPlan,
  getWorkoutPlans,
  getWorkoutPlanById,
  updateWorkoutPlan,
  deleteWorkoutPlan,
};