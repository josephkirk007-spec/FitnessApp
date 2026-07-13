const Client = require('../models/Client');

// Get all clients 
const getClients = async (req, res) => {
    try {
        const clients = await Client.find({ coach: req.user.id });
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new client
const createClient = async (req, res) => {
    try {
        const client = await Client.create({
            coach: req.user.id,
            name: req.body.name,
            age: req.body.age,
            goal: req.body.goal,
            fitnessLevel: req.body.fitnessLevel,
            workoutDays: req.body.workoutDays,
            equipment: req.body.equipment,
            dietPreferences: req.body.dietPreferences,
            foodRestrictions: req.body.foodRestrictions,
            notes: req.body.notes
        });
        res.status(201).json(client);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get one client
const getClientById = async (req, res) => {
    try {
        const client = await Client.findOne({
            _id: req.params.id,
            coach: req.user._id,
        });

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete client
const deleteClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        await client.deleteOne();
        res.status(200).json({ message: 'Client deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getClients,
    createClient,
    getClientById,
    deleteClient
};