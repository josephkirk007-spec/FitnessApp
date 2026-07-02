const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    coach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: [true, "Please add a client name"],
    },
    age: {
        type: Number,
        required: [true, "Please add a client age"],
    },
    goal: {
        type: String,
        required: [true, "Please add a fitness goal"],
    },
    fitnessLevel: {
        type: String,
        required: [true, "Please add a fitness level"],
    },
    workoutDays: {
        type: Number,
        required: [true, "Please add workout days"],
    },
    equipment: {
        type: String,
        required: [true, "Please add available equipment"],
    },
    dietPreferences: {
        type: String,
        required: [true, "Please add diet preferences"],
    },
    foodRestrictions: {
        type: String,
        default: "None",
    },
    notes: {
        type: String,
        default: "No additional notes",
    },
},
{
    timestamps: true,
});