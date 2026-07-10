const express = require('express');
const { 
    createPlan, 
    generatePlan,
    getPlans } = require('../controllers/planController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Route to create a new plan
router.route('/').get(protect, getPlans).post(protect, createPlan);

router.post('/generate', protect, generatePlan);

module.exports = router;