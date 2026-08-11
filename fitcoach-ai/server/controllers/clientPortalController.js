const Client = require("../models/Client");
const WorkoutPlan = require("../models/WorkoutPlan");
const DietPlan = require("../models/DietPlan");

const getMyPortal = async (req, res) => {
  try {
    const clientId = req.user.client;

    if (!clientId) {
      return res.status(404).json({
        message: "No client profile is connected to this account.",
      });
    }

    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({
        message: "Client profile not found.",
      });
    }

    const workoutPlans = await WorkoutPlan.find({
      client: clientId,
    }).sort({
      createdAt: -1,
    });

    const dietPlans = await DietPlan.find({
      client: clientId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      client,
      workoutPlans,
      dietPlans,
    });
  } catch (error) {
    console.error("CLIENT PORTAL ERROR:", error);

    return res.status(500).json({
      message: "Unable to load client portal.",
    });
  }
};

module.exports = {
  getMyPortal,
};