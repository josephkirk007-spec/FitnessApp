const express = require("express");

const {
    generateAndSaveDietPlan,
    getDietPlans,
    getDietPlanById,
    updateDietPlan,
    deleteDietPlan,
} = require("../controllers/dietPlanController");

const { protect } = require("../middleware/authMiddleware");
const { coachOnly } = require("../middleware/roleMiddleware");

const router = express.Router();

//Get every saved diet plan for the logged-in coach
router.get("/", protect, coachOnly, getDietPlans);

//Generate and save a new diet plan
router.post("/generate/:clientId", protect, coachOnly, generateAndSaveDietPlan);

//Get, update, and delete diet plan
router
  .route("/:id")
  .get(protect, coachOnly, getDietPlanById)
  .put(protect, coachOnly, updateDietPlan)
  .delete(protect, coachOnly, deleteDietPlan);

  module.exports = router;