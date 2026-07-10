const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    coach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
    },
    workoutPlan: {
        type: String,
        required: true,
    },
    dietPlan: {
        type: String,
        required: true,
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model('Plan', planSchema);