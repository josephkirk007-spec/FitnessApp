require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

// Your existing local plan generators
const {
  generateWorkoutData,
} = require("./workoutService");

const {
  generateDietData,
} = require("./dietService");

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    })
  : null;

const geminiModel = process.env.GEMINI_MODEL || "gemini-flash-latest"

/*
  Removes Markdown code fences if the AI includes them,
  then converts the response into a JavaScript object.
*/
const parseAIResponse = (text) => {
  if (!text || typeof text !== "string") {
    throw new Error(
      "The AI returned an empty response."
    );
  }

  const cleanedText = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanedText);
};

/*
  Basic validation prevents incomplete AI responses
  from being saved to MongoDB.
*/
const isValidWorkoutPlan = (plan) => {
  return Boolean(
    plan &&
      typeof plan === "object" &&
      typeof plan.title === "string" &&
      plan.title.trim() &&
      Number.isFinite(Number(plan.weeks)) &&
      Number.isFinite(
        Number(plan.workoutDays)
      ) &&
      Array.isArray(plan.exercises) &&
      plan.exercises.length > 0
  );
};

const isValidDietPlan = (plan) => {
  return Boolean(
    plan &&
      typeof plan === "object" &&
      typeof plan.title === "string" &&
      plan.title.trim() &&
      Number.isFinite(
        Number(plan.dailyCalories)
      ) &&
      Array.isArray(plan.meals) &&
      plan.meals.length > 0
  );
};

/*
  AI workout generator with automatic local fallback.
*/
const generateWorkoutPlan = async (client) => {
  try {
    if (!ai) {
      throw new Error(
        "GEMINI_API_KEY is not configured."
      );
    }

    const prompt = `
You are assisting a fitness coach.

Create a safe and realistic workout plan using the
client information below.

CLIENT:
Name: ${client.name || "Client"}
Age: ${client.age || "Not provided"}
Goal: ${client.goal || "General fitness"}
Fitness level: ${
      client.fitnessLevel || "Beginner"
    }
Workout days: ${client.workoutDays || 3}
Equipment: ${
      client.equipment || "Basic equipment"
    }
Limitations: ${
      client.limitations || "None provided"
    }

REQUIREMENTS:
- Match the exercises to the client's goal.
- Use different exercises on different days.
- Include sets, repetitions, and rest periods.
- Keep the plan appropriate for the fitness level.
- Avoid extreme or unsafe recommendations.
- Return only valid JSON.
- Do not use Markdown.

Return this exact structure:

{
  "title": "string",
  "weeks": 4,
  "workoutDays": 3,
  "exercises": [
    {
      "day": "Day 1",
      "focus": "string",
      "workout": [
        {
          "name": "string",
          "sets": 3,
          "reps": "8-12",
          "rest": "60 seconds"
        }
      ]
    }
  ],
  "notes": "string"
}
`;

    const response =
      await ai.models.generateContent({
        model: geminiModel,
        contents: prompt,
        config: {
          responseMimeType:
            "application/json",
          temperature: 0.5,
        },
      });

    const aiPlan = parseAIResponse(
      response.text
    );

    if (!isValidWorkoutPlan(aiPlan)) {
      throw new Error(
        "Gemini returned an incomplete workout plan."
      );
    }

    console.log(
      "Workout plan generated with Gemini."
    );

    return {
      plan: {
        ...aiPlan,
        weeks: Number(aiPlan.weeks),
        workoutDays: Number(
          aiPlan.workoutDays
        ),
      },
      source: "ai",
      fallbackUsed: false,
    };
  } catch (error) {
    console.error(
      "Gemini workout generation failed:",
      error.message
    );

    console.log(
      "Using local workout generator..."
    );

    const localPlan =
      await generateWorkoutData(client);

    if (!localPlan) {
      throw new Error(
        "Both AI and local workout generation failed."
      );
    }

    return {
      plan: localPlan,
      source: "local",
      fallbackUsed: true,
      fallbackReason: error.message,
    };
  }
};

/*
  AI diet generator with automatic local fallback.
*/
const generateDietPlan = async (client) => {
  try {
    if (!ai) {
      throw new Error(
        "GEMINI_API_KEY is not configured."
      );
    }

    const prompt = `
You are assisting a fitness coach with general
meal-planning ideas.

Create a balanced diet plan using the client
information below.

CLIENT:
Name: ${client.name || "Client"}
Age: ${client.age || "Not provided"}
Goal: ${client.goal || "General wellness"}
Diet preference: ${
      client.dietPreference || "No preference"
    }
Food restrictions: ${
      client.foodRestrictions ||
      "None provided"
    }
Allergies: ${
      client.allergies || "None provided"
    }
Daily calories: ${
      client.dailyCalories ||
      "Estimate a reasonable amount"
    }

REQUIREMENTS:
- Respect every allergy and food restriction.
- Include breakfast, lunch, dinner, and snacks.
- Do not recommend crash diets or extreme restriction.
- Present the plan as general educational guidance.
- Return only valid JSON.
- Do not use Markdown.

Return this exact structure:

{
  "title": "string",
  "dailyCalories": 2200,
  "protein": 150,
  "carbs": 240,
  "fat": 70,
  "meals": [
    {
      "meal": "Breakfast",
      "foods": [
        "food one",
        "food two"
      ],
      "estimatedCalories": 500
    }
  ],
  "notes": "string"
}
`;

    const response =
      await ai.models.generateContent({
        model: geminiModel,
        contents: prompt,
        config: {
          responseMimeType:
            "application/json",
          temperature: 0.4,
        },
      });

    const aiPlan = parseAIResponse(
      response.text
    );

    if (!isValidDietPlan(aiPlan)) {
      throw new Error(
        "Gemini returned an incomplete diet plan."
      );
    }

    console.log(
      "Diet plan generated with Gemini."
    );

    return {
      plan: {
        ...aiPlan,
        dailyCalories: Number(
          aiPlan.dailyCalories
        ),
        protein: Number(aiPlan.protein),
        carbs: Number(aiPlan.carbs),
        fat: Number(aiPlan.fat),
      },
      source: "ai",
      fallbackUsed: false,
    };
  } catch (error) {
    console.error(
      "Gemini diet generation failed:",
      error.message
    );

    console.log(
      "Using local diet generator..."
    );

    const localPlan =
      await generateDietData(client);

    if (!localPlan) {
      throw new Error(
        "Both AI and local diet generation failed."
      );
    }

    return {
      plan: localPlan,
      source: "local",
      fallbackUsed: true,
      fallbackReason: error?.message || "Unknown Gemini Error",
    };


  }
};

module.exports = {
  generateWorkoutPlan,
  generateDietPlan,
};