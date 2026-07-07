const express = require('express');

const {
    getClients,
    createClient,
    getClientById,
    deleteClient,
} = require('../controllers/clientController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getClients).post(protect, createClient);
router.route('/:id').get(protect, getClientById).delete(protect, deleteClient);

module.exports = router;