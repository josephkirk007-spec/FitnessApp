const DietPlan = require("../models/DietPlan");
const Client = require("../models/Client");
const {
  generateDietPlan,
} = require("../services/geminiService");

//const { generateDietData } = require("../services/dietService");

// @desc    Generate and save a diet plan
// @route   POST /api/v1/diets/generate
// @access  Private
const generateAndSaveDietPlan = async (
  req,
  res,
  next
) => {
  try {
    const client = await Client.findOne({
      _id: req.params.clientId,
      coach: req.user._id,
    });

    if (!client) {
      return res.status(404).json({
        message: "Client not found.",
      });
    }

    const generationResult =
      await generateDietPlan(client);

    const generatedPlan =
      generationResult.plan;

    const savedPlan =
      await DietPlan.create({
        ...generatedPlan,
        client: client._id,
        coach: req.user._id,

        generationSource:
          generationResult.source,

        fallbackUsed:
          generationResult.fallbackUsed,
      });

    await savedPlan.populate(
      "client",
      "name goal dietPreference"
    );

    return res.status(201).json({
      message: generationResult.fallbackUsed
        ? "Gemini was unavailable, so a local diet plan was generated."
        : "AI diet plan generated successfully.",

      source: generationResult.source,
      fallbackUsed:
        generationResult.fallbackUsed,

      plan: savedPlan,
    });
  } catch (error) {
    console.error(
      "DIET GENERATION ERROR:",
      error
    );

    return next(error);
  }
};

// @desc    Get all diet plans for logged-in coach
// @route   GET /api/v1/diets
// @access  Private
const getDietPlans = async (req, res) => {
  try {
    const dietPlans = await DietPlan.find({
      coach: req.user._id,
    })
      .populate(
        "client",
        "name age goal dietPreference foodRestrictions"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json(dietPlans);
  } catch (error) {
    console.error("GET DIET PLANS ERROR:", error);

    return res.status(500).json({
      message:
        error.message || "Unable to retrieve diet plans",
    });
  }
};

// @desc    Get one diet plan
// @route   GET /api/v1/diets/:id
// @access  Private
const getDietPlanById = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findOne({
      _id: req.params.id,
      coach: req.user._id,
    }).populate(
      "client",
      "name age goal dietPreference foodRestrictions"
    );

    if (!dietPlan) {
      return res.status(404).json({
        message: "Diet plan not found",
      });
    }

    return res.status(200).json(dietPlan);
  } catch (error) {
    console.error("GET DIET PLAN ERROR:", error);

    return res.status(500).json({
      message:
        error.message || "Unable to retrieve diet plan",
    });
  }
};

// @desc    Update one diet plan
// @route   PUT /api/v1/diets/:id
// @access  Private
const updateDietPlan = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findOne({
      _id: req.params.id,
      coach: req.user._id,
    });

    if (!dietPlan) {
      return res.status(404).json({
        message: "Diet plan not found",
      });
    }

    // Only update fields that the coach is allowed to edit.
    const allowedUpdates = {
      title: req.body.title,
      dietPreference: req.body.dietPreference,
      dailyCalories: req.body.dailyCalories,
      protein: req.body.protein,
      carbs: req.body.carbs,
      fat: req.body.fat,
      meals: req.body.meals,
      foodRestrictions: req.body.foodRestrictions,
      notes: req.body.notes,
    };

    // Remove undefined fields so existing values
    // are not accidentally overwritten.
    Object.keys(allowedUpdates).forEach((key) => {
      if (allowedUpdates[key] === undefined) {
        delete allowedUpdates[key];
      }
    });

    const updatedDietPlan =
      await DietPlan.findByIdAndUpdate(
        dietPlan._id,
        allowedUpdates,
        {
          new: true,
          runValidators: true,
        }
      );

    return res.status(200).json(updatedDietPlan);
  } catch (error) {
    console.error("UPDATE DIET PLAN ERROR:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (item) => item.message
      );

      return res.status(400).json({
        message: messages.join(", "),
      });
    }

    return res.status(500).json({
      message:
        error.message || "Unable to update diet plan",
    });
  }
};

// @desc    Delete one diet plan
// @route   DELETE /api/v1/diets/:id
// @access  Private
const deleteDietPlan = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findOne({
      _id: req.params.id,
      coach: req.user._id,
    });

    if (!dietPlan) {
      return res.status(404).json({
        message: "Diet plan not found",
      });
    }

    await dietPlan.deleteOne();

    return res.status(200).json({
      message: "Diet plan deleted successfully",
      id: dietPlan._id,
    });
  } catch (error) {
    console.error("DELETE DIET PLAN ERROR:", error);

    return res.status(500).json({
      message:
        error.message || "Unable to delete diet plan",
    });
  }
};

module.exports = {
  generateAndSaveDietPlan,
  getDietPlans,
  getDietPlanById,
  updateDietPlan,
  deleteDietPlan,
};