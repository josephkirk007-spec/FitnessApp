const mongoose = require("mongoose");

const workoutPlanSchema = new mongoose.Schema(
  {
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    weeks: {
      type: Number,
      default: 4,
    },

    workoutDays: {
      type: Number,
      required: true,
    },

    exercises: [
      {
        day: {
          type: String,
          required: true,
          trim: true,
        },

        focus: {
          type: String,
          default: "",
          trim: true,
        },

        workout: {
          type: [String],
          required: true,
          default: [],
        },
      },
    ],

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "WorkoutPlan",
  workoutPlanSchema
);