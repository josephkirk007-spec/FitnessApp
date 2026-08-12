const express = require('express');

const { registerUser, loginUser, createClientLogin, getMe, resetPassword, changePassword } = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');
const { coachOnly } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/client-login', protect, coachOnly, createClientLogin);
router.put('/reset-password', resetPassword);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

module.exports = router;