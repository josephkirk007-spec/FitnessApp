const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const workoutSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "weeks",
    "workoutDays",
    "exercises",
    "notes",
  ],
  properties: {
    title: {
      type: "string",
    },

    weeks: {
      type: "integer",
      minimum: 1,
      maximum: 12,
    },

    workoutDays: {
      type: "integer",
      minimum: 1,
      maximum: 7,
    },

    exercises: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["day", "focus", "workout"],
        properties: {
          day: {
            type: "string",
          },

          focus: {
            type: "string",
          },

          workout: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      },
    },

    notes: {
      type: "string",
    },
  },
};

const dietSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "dietPreference",
    "dailyCalories",
    "protein",
    "carbs",
    "fat",
    "meals",
    "foodRestrictions",
    "notes",
  ],
  properties: {
    title: {
      type: "string",
    },

    dietPreference: {
      type: "string",
    },

    dailyCalories: {
      type: "integer",
      minimum: 1000,
      maximum: 5000,
    },

    protein: {
      type: "integer",
      minimum: 0,
    },

    carbs: {
      type: "integer",
      minimum: 0,
    },

    fat: {
      type: "integer",
      minimum: 0,
    },

    meals: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "mealName",
          "foods",
          "calories",
          "protein",
          "carbs",
          "fat",
        ],
        properties: {
          mealName: {
            type: "string",
          },

          foods: {
            type: "array",
            items: {
              type: "string",
            },
          },

          calories: {
            type: "integer",
            minimum: 0,
          },

          protein: {
            type: "integer",
            minimum: 0,
          },

          carbs: {
            type: "integer",
            minimum: 0,
          },

          fat: {
            type: "integer",
            minimum: 0,
          },
        },
      },
    },

    foodRestrictions: {
      type: "string",
    },

    notes: {
      type: "string",
    },
  },
};

const createStructuredPlan = async ({
  schemaName,
  schema,
  instructions,
  prompt,
}) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.6",

    instructions,

    input: prompt,

    text: {
      format: {
        type: "json_schema",
        name: schemaName,
        strict: true,
        schema,
      },
    },
  });

  if (!response.output_text) {
    throw new Error("The AI returned an empty response");
  }

  return JSON.parse(response.output_text);
};

const generateAIWorkoutData = async (client) => {
  const workoutDays = Math.min(
    Math.max(Number(client.workoutDays) || 3, 1),
    7
  );

  const prompt = `
Create a personalized workout plan for this client.

Client:
- Name: ${client.name}
- Age: ${client.age}
- Goal: ${client.goal}
- Fitness level: ${client.fitnessLevel}
- Workout days: ${workoutDays}
- Equipment: ${client.equipment}
- Coach notes: ${client.notes || "None"}

Requirements:
- Return exactly ${workoutDays} workout days.
- Give every day a different training focus.
- Do not repeat the exact same exercise list.
- Match exercises to the client's equipment and experience.
- Include warm-up, main exercises, and cool-down.
- Include sets, repetitions, duration, or distance.
- Keep the plan practical and avoid extreme training volume.
- Use four weeks unless the client information suggests otherwise.
`;

  const plan = await createStructuredPlan({
    schemaName: "titan_workout_plan",
    schema: workoutSchema,
    instructions:
      "You create practical fitness plans. Do not diagnose medical conditions or promise guaranteed results.",
    prompt,
  });

  if (plan.exercises.length !== workoutDays) {
    throw new Error(
      `Expected ${workoutDays} workout days but received ${plan.exercises.length}`
    );
  }

  return {
    ...plan,
    workoutDays,
  };
};

const generateAIDietData = async (client) => {
  const prompt = `
Create a general meal-planning suggestion for this client.

Client:
- Name: ${client.name}
- Age: ${client.age}
- Goal: ${client.goal}
- Diet preference: ${client.dietPreference || "Balanced"}
- Foods or allergies to avoid: ${
    client.foodRestrictions || "None"
  }
- Coach notes: ${client.notes || "None"}

Requirements:
- Follow the stated diet preference.
- Do not include any listed restricted foods.
- Include breakfast, lunch, dinner, and one snack.
- Return daily calorie and macronutrient estimates.
- Make the meal totals approximately match the daily totals.
- Avoid crash diets, extreme calorie restriction, supplements, or medical claims.
- State that portions may need adjustment and allergies must be reviewed.
`;

  return createStructuredPlan({
    schemaName: "titan_diet_plan",
    schema: dietSchema,
    instructions:
      "You create general nutrition-planning suggestions, not medical treatment. Avoid extreme restriction and clearly respect allergies.",
    prompt,
  });
};

module.exports = {
  generateAIWorkoutData,
  generateAIDietData,
};