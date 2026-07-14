const Client = require('../models/Client');

// Get all clients 
const getClients = async (req, res) => {
    try {
        console.log("Fetching clients for:", req.user);

        const clients = await Client.find({ 
            coach: req.user.id,
         }).sort({ createdAt: -1 });

        res.status(200).json(clients);
    } catch (error) {
        console.error("GET CLIENTS ERROR:", error);
        
        res.status(500).json({ message: error.message });
    }
};

// Create a new client
const createClient = async (req, res) => {
    try {
        console.log("Logged-in User:", req.user);
        console.log("Client request body:", req.body);

        if(!req.user) {
            return res.status(401).json({
                message: "You must be logged in to create a client.",
            });
        }
        
        const {
            name,
            age,
            goal,
            fitnessLevel,
            workoutDays,
            equipment,
            dietPreference,
            foodRestrictions,
            notes,
        } = req.body;

        if (
          !name ||
          !age ||
          !goal ||
          !fitnessLevel ||
          !workoutDays ||
          !equipment ||
          !dietPreference
        ) {
            return res.status(400).json({
                message: "Please complete all required client fields",
            });
        }

        const client = await Client.create({
            coach: req.user.id,
            name,
            age: Number(age),
            goal,
            fitnessLevel,
            workoutDays: Number(workoutDays),
            equipment,
            dietPreference,
            foodRestrictions: foodRestrictions || "None",
            notes: notes?.trim() || "",
        });
        res.status(201).json(client);
    } catch (error) {
        console.error("CREATE CLIENT ERROR:", error);

        if(error.name === "ValidationError") {
            const validationMessages = Object.values(error.errors).map(
                (item) => item.message
            );

            return res.status(400).json({
                message: validationMessages.join(", "),
            });
        }

        return res.status(500).json({
             message: error.message || "Server error while creating client",
        });
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

// Update Client
const updateClient = async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      coach: req.user._id,
    });

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    const updatedClient = await Client.findOneAndUpdate(
      {
        _id: req.params.id,
        coach: req.body,
      },
      {
        name: req.body.name?.trim(),
        age: Number(req.body.age),
        goal: req.body.goal,
        fitnessLevel: req.body.fitnessLevel,
        workoutDays: Number(req.body.workoutDays),
        dietPreference: req.body.dietPreference,
        foodRestrictions: req.body.foodRestrictions?.trim() || "None",
        notes: req.body.notes?.trim() || "None",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(updatedClient);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete client
const deleteClient = async (req, res) => {
    try {
        const client = await Client.findOne({
            _id: req.params.id,
            coach: req.user._id,
        });

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
    updateClient,
    deleteClient
};