const express = require("express");

const {
    createWorkoutPlan,
    generateWorkoutPlan,
    getWorkoutPlans,
    getWorkoutPlanById,
    updateWorkoutPlan,
    deleteWorkoutPlan,
} = require("../controllers/workoutPlanController");


const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(protect, getWorkoutPlans)
  .post(protect, createWorkoutPlan);

router.post("/generate", protect, generateWorkoutPlan);

router
  .route("/:id")
  .get(protect, getWorkoutPlanById)
  .put(protect, updateWorkoutPlan)
  .delete(protect, deleteWorkoutPlan);

module.exports = router;