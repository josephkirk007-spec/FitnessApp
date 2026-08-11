const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
    },

    role: {
        type: String,
        enum: ['coach', 'client'],
        default: 'coach',
    },

    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        default: null,
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);