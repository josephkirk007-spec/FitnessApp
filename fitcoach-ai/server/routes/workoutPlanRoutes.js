const express = require("express");

const {
    createWorkoutPlan,
    generateAndSaveWorkoutPlan,
    getWorkoutPlans,
    getWorkoutPlanById,
    updateWorkoutPlan,
    deleteWorkoutPlan,
} = require("../controllers/workoutPlanController");


const { protect } = require("../middleware/authMiddleware");
const { coachOnly } = require("../middleware/roleMiddleware");

const router = express.Router();

router
  .route("/")
  .get(protect, coachOnly, getWorkoutPlans)
  .post(protect, coachOnly, createWorkoutPlan);

router.post("/generate/:clientId", protect, coachOnly, generateAndSaveWorkoutPlan);

router
  .route("/:id")
  .get(protect, coachOnly, getWorkoutPlanById)
  .put(protect, coachOnly, updateWorkoutPlan)
  .delete(protect, coachOnly, deleteWorkoutPlan);

module.exports = router;