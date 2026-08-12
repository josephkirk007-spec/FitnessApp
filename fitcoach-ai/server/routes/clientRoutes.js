const express = require('express');

const {
    getClients,
    createClient,
    getClientById,
    updateClient,
    deleteClient,
} = require('../controllers/clientController');

const { protect } = require('../middleware/authMiddleware');
const { coachOnly } = require('../middleware/roleMiddleware');

const router = express.Router();

router
 .route('/')
 .get(protect, coachOnly, getClients)
 .post(protect, coachOnly, createClient);

 router
  .route('/:id')
  .get(protect, coachOnly, getClientById)
  .put(protect, coachOnly, updateClient)
  .delete(protect, coachOnly, deleteClient);

module.exports = router;