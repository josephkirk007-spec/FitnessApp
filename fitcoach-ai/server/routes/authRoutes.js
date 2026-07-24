const express = require('express');

const { registerUser, loginUser, getMe, resetPassword } = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/reset-password', resetPassword);
router.get('/me', protect, getMe);

module.exports = router;