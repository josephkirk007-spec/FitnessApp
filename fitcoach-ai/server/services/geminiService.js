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

const geminiModel = process.env.GEMINI_MODEL || "gemini-flash-latest";

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

const normalizeWorkoutPlan = (plan, expectedWorkoutDays) => {
  return {
    ...plan,

    title:
      typeof plan?.title === "string"
        ? plan.title
        : "AI Workout Plan",

    weeks: Number(plan?.weeks) || 4,

    workoutDays:
      Number(expectedWorkoutDays) ||
      Number(plan?.workoutDays) ||
      plan?.exercises?.length ||
      3,

    exercises: Array.isArray(plan?.exercises)
      ? plan.exercises.map((day, index) => ({
          day: day?.day || `Day ${index + 1}`,

          focus:
            day?.focus ||
            "General Fitness",

          workout: Array.isArray(day?.workout)
            ? day.workout.map((exercise) => {
                // Existing local-plan strings stay unchanged.
                if (typeof exercise === "string") {
                  return exercise;
                }

                // Convert Gemini objects into strings.
                const name =
                  exercise?.name || "Exercise";

                const sets = exercise?.sets
                  ? `${exercise.sets} sets`
                  : "";

                const reps = exercise?.reps
                  ? `${exercise.reps} reps`
                  : "";

                const rest = exercise?.rest
                  ? `${exercise.rest} rest`
                  : "";

                return [
                  name,
                  sets,
                  reps,
                  rest,
                ]
                  .filter(Boolean)
                  .join(" — ");
              })
            : [],
        }))
      : [],

    notes:
      typeof plan?.notes === "string"
        ? plan.notes
        : "",
  };
};

const normalizeDietPlan = (plan) => {
  return {
    ...plan,

    title:
      typeof plan?.title === "string"
        ? plan.title
        : "AI Diet Plan",

    dailyCalories:
      Number(plan?.dailyCalories) || 2000,

    protein:
      Number(plan?.protein) || 0,

    carbs:
      Number(plan?.carbs) || 0,

    fat:
      Number(plan?.fat) || 0,

    meals: Array.isArray(plan?.meals)
      ? plan.meals.map((meal, index) => ({
          mealName:
            meal?.mealName ||
            meal?.meal ||
            `Meal ${index + 1}`,

          foods: Array.isArray(meal?.foods)
            ? meal.foods.map((food) => {
                if (typeof food === "string") {
                  return food;
                }

                return (
                  food?.name ||
                  food?.food ||
                  "Food item"
                );
              })
            : [],
          calories: Number(
            meal?.calories ??
              meal?.estimatedCalories ??
              0
          ),
          estimatedCalories:
            Number(
              meal?.estimatedCalories ??
              meal?.calories ?? 
              0
            ),
            protein: Number(
              meal?.protein ??
              meal?.marco?.protein ??
              0
            ),
          carbs: Number(
            meal?.carbs ??
            meal?.carbohydrates ??
            meal?.marco?.carbs ??
            meal?.marco?.carbohydrates ??
            0
          ),
          fat: Number(
            meal?.fat ??
              meal?.marco?.fat ??
              0
          ),
        }))
        : [],

    notes:
      typeof plan?.notes === "string"
        ? plan.notes
        : "",
  };
};

/*
  Basic validation prevents incomplete AI responses
  from being saved to MongoDB.
*/
const isValidWorkoutPlan = (plan, requestedDays) => {
  const days = Number(requestedDays);

  if (!plan) {
    return false;
  }

  if (!Array.isArray(plan.exercises)) {
    return false;
  }

  if (plan.exercises.length !== days) {
    console.log(
      `Invalid workout plan: expected ${days} days but received ${plan.exercises.length}`
    );

    return false;
  }

  const everyDayIsValid = plan.exercises.every((day) => {
    return (
      day &&
      day.day &&
      Array.isArray(day.workout) &&
      day.workout.length > 0
    );
  });

  return everyDayIsValid;
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
      plan.meals.length > 0 &&
      plan.meals.every(
        (meal) =>
          typeof meal.mealName === "string" &&
        meal.mealName.trim() &&
        Array.isArray(meal.foods)
      )
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
- You MUST generate exactly ${client.workoutDays} workout days.
- The exercises array MUST contain exactly ${client.workoutDays} objects.
- For example, if workoutDays is 6: exercises must contain 6 objects, one for each day.
- Do not return fewer workout days than specified.
- Avoid extreme or unsafe recommendations.
- Return only valid JSON.
- Do not use Markdown.

Return this exact structure:

{
  "title": "string",
  "weeks": 4,
  "workoutDays": ${client.workoutDays || 3},
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
    const expectedWorkoutDays =
      Number(client.workoutDays) || 3;
    const normalizedPlan =
      normalizeWorkoutPlan(aiPlan, expectedWorkoutDays);

    console.log(
      "NORMALIZED AI WORKOUT:",
      JSON.stringify(normalizedPlan, null, 2)
    );

    if(!Array.isArray(normalizedPlan.exercises) || normalizedPlan.exercises.length !== expectedWorkoutDays) {
      throw new Error(
        `Gemini returned ${normalizedPlan.exercises.length} workout days, but ${expectedWorkoutDays} were expected.`
      );
    }

    if (!isValidWorkoutPlan(normalizedPlan, expectedWorkoutDays)) {
      throw new Error(
        "Gemini returned an incomplete workout plan."
      );
    }

    console.log(
      "Workout plan generated with Gemini."
    );

    return {
      plan: normalizedPlan,
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
      "mealName": "Breakfast",
      "foods": [
        "food one",
        "food two"
      ],
      "calories": 500,
      "protein": 40,
      "carbs": 55,
      "fat": 15
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

    const normalizedPlan =
      normalizeDietPlan(aiPlan);

    console.log(
      "NORMALIZED AI DIET:",
      JSON.stringify(normalizedPlan, null, 2)
    );

    if (!isValidDietPlan(normalizedPlan)) {
      throw new Error(
        "Gemini returned an incomplete diet plan."
      );
    }

    console.log(
      "Diet plan generated with Gemini."
    );

    return {
      plan: normalizedPlan,
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