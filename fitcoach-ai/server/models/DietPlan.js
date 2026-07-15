const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
    {
        mealName: {
            type: String,
            required: true,
            trim: true,
        },

        foods: {
            type: [String],
            default: [],
        },

        calories: {
            type: Number,
            default: 0,
            min: 0,
        },

        protein: {
            type: Number,
            default: 0,
            min: 0,
        },

        carbs: {
            type: Number,
            default: 0,
            min: 0,
        },

        fat: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        _id: true,
    }
);

const dietPlanSchema = new mongoose.Schema(
    {
        coach: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },

        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true,
        },

        title: {
            type: String,
            required: [true, "Please add a diet-plan title"],
            trim: true,
        },

        dietPreference: {
            type: String,
            required: [true, "Please add a diet preference"],
            trim: true,
        },

        dailyCalories: {
            type: Number,
            required: [true, "Please add daily calories"],
            min: [1000, "Daily calories must be at least 1000"],
        },

        protein: {
            type: Number,
            required: true,
            min: 0,
        },

        fat: {
            type: Number,
            required: true,
            min: 0,
        },

        meals: {
            type: [mealSchema],
            default: [],
        },

        foodRestrictions: {
            type: String,
            default: "None",
            trim: true,
        },

        notes: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("DietPlan", dietPlanSchema);