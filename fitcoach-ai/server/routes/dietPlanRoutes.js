const express = require("express");

const {
    generateDietPlan,
    getDietPlans,
    getDietPlanById,
    updateDietPlan,
    deleteDietPlan,
} = require("../controllers/dietPlanController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

//Get every saved diet plan for the logged-in coach
router.get("/", protect, getDietPlans);

//Generate and save a new diet plan
router.post("/generate", protect, generateDietPlan);

//Get, update, and delete diet plan
router
  .route("/:id")
  .get(protect, getDietPlanById)
  .put(protect, updateDietPlan)
  .delete(protect, deleteDietPlan);

  module.exports = router;