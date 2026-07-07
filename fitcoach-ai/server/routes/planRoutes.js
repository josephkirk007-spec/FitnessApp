const express = require('express');
const { createPlan, getPlans } = require('../controllers/planController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Route to create a new plan
router.route('/').get(protect, createPlan).post(protect, createPlan);

module.exports = router;