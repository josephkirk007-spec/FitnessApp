const getCalorieTarget = (client) => {
  const baseCalories = 2000;

  const goalAdjustments = {
    "Lose body fat": -300,
    "Gain muscle": 300,
    "Improve strength": 200,
    "Improve endurance": 150,
    "General fitness": 0,
  };

  const goalAdjustment =
    goalAdjustments[client.goal] || 0;

  const ageAdjustment =
    Number(client.age) >= 50 ? -100 : 0;

  return baseCalories + goalAdjustment + ageAdjustment;
};

const calculateMacros = (dailyCalories, goal) => {
  let proteinPercent = 0.3;
  let carbsPercent = 0.4;
  let fatPercent = 0.3;

  if (goal === "Gain muscle") {
    proteinPercent = 0.35;
    carbsPercent = 0.4;
    fatPercent = 0.25;
  }

  if (goal === "Improve endurance") {
    proteinPercent = 0.25;
    carbsPercent = 0.5;
    fatPercent = 0.25;
  }

  if (goal === "Lose body fat") {
    proteinPercent = 0.35;
    carbsPercent = 0.35;
    fatPercent = 0.3;
  }

  return {
    protein: Math.round(
      (dailyCalories * proteinPercent) / 4
    ),

    carbs: Math.round(
      (dailyCalories * carbsPercent) / 4
    ),

    fat: Math.round(
      (dailyCalories * fatPercent) / 9
    ),
  };
};

const getMealTemplates = (dietPreference) => {
  const mealTemplates = {
    Balanced: [
      {
        mealName: "Breakfast",
        foods: [
          "Oatmeal",
          "Blueberries",
          "Scrambled eggs",
        ],
      },
      {
        mealName: "Lunch",
        foods: [
          "Grilled chicken",
          "Brown rice",
          "Mixed vegetables",
        ],
      },
      {
        mealName: "Snack",
        foods: [
          "Greek yogurt",
          "Banana",
        ],
      },
      {
        mealName: "Dinner",
        foods: [
          "Baked salmon",
          "Sweet potato",
          "Green beans",
        ],
      },
    ],

    "High protein": [
      {
        mealName: "Breakfast",
        foods: [
          "Egg-white omelet",
          "Whole-grain toast",
          "Greek yogurt",
        ],
      },
      {
        mealName: "Lunch",
        foods: [
          "Turkey breast",
          "Quinoa",
          "Mixed vegetables",
        ],
      },
      {
        mealName: "Snack",
        foods: [
          "Cottage cheese",
          "Berries",
        ],
      },
      {
        mealName: "Dinner",
        foods: [
          "Lean beef",
          "Roasted potatoes",
          "Broccoli",
        ],
      },
    ],

    Vegetarian: [
      {
        mealName: "Breakfast",
        foods: [
          "Oatmeal",
          "Peanut butter",
          "Banana",
        ],
      },
      {
        mealName: "Lunch",
        foods: [
          "Chickpea bowl",
          "Brown rice",
          "Spinach",
        ],
      },
      {
        mealName: "Snack",
        foods: [
          "Greek yogurt",
          "Mixed berries",
        ],
      },
      {
        mealName: "Dinner",
        foods: [
          "Lentil pasta",
          "Tomato sauce",
          "Roasted vegetables",
        ],
      },
    ],

    Vegan: [
      {
        mealName: "Breakfast",
        foods: [
          "Oatmeal",
          "Almond butter",
          "Blueberries",
        ],
      },
      {
        mealName: "Lunch",
        foods: [
          "Tofu",
          "Quinoa",
          "Mixed vegetables",
        ],
      },
      {
        mealName: "Snack",
        foods: [
          "Apple",
          "Peanut butter",
        ],
      },
      {
        mealName: "Dinner",
        foods: [
          "Black beans",
          "Brown rice",
          "Avocado",
        ],
      },
    ],

    "Low carbohydrate": [
      {
        mealName: "Breakfast",
        foods: [
          "Eggs",
          "Avocado",
          "Turkey sausage",
        ],
      },
      {
        mealName: "Lunch",
        foods: [
          "Grilled chicken salad",
          "Olive oil dressing",
        ],
      },
      {
        mealName: "Snack",
        foods: [
          "Greek yogurt",
          "Almonds",
        ],
      },
      {
        mealName: "Dinner",
        foods: [
          "Baked salmon",
          "Broccoli",
          "Cauliflower rice",
        ],
      },
    ],

    Mediterranean: [
      {
        mealName: "Breakfast",
        foods: [
          "Greek yogurt",
          "Berries",
          "Walnuts",
        ],
      },
      {
        mealName: "Lunch",
        foods: [
          "Chicken pita bowl",
          "Hummus",
          "Cucumber",
        ],
      },
      {
        mealName: "Snack",
        foods: [
          "Apple",
          "Mixed nuts",
        ],
      },
      {
        mealName: "Dinner",
        foods: [
          "Grilled fish",
          "Quinoa",
          "Roasted vegetables",
        ],
      },
    ],
  };

  return (
    mealTemplates[dietPreference] ||
    mealTemplates.Balanced
  );
};

const addMealNutrition = (meals, dailyCalories, macros) => {
  const mealCount = meals.length;

  return meals.map((meal) => ({
    ...meal,

    calories: Math.round(
      dailyCalories / mealCount
    ),

    protein: Math.round(
      macros.protein / mealCount
    ),

    carbs: Math.round(
      macros.carbs / mealCount
    ),

    fat: Math.round(
      macros.fat / mealCount
    ),
  }));
};

const generateDietData = (client) => {
  const dailyCalories = getCalorieTarget(client);

  const macros = calculateMacros(
    dailyCalories,
    client.goal
  );

  const mealTemplates = getMealTemplates(
    client.dietPreference
  );

  const meals = addMealNutrition(
    mealTemplates,
    dailyCalories,
    macros
  );

  return {
    title: `${client.name}'s ${client.dietPreference} Diet Plan`,

    dietPreference:
      client.dietPreference || "Balanced",

    dailyCalories,

    protein: macros.protein,
    carbs: macros.carbs,
    fat: macros.fat,

    meals,

    foodRestrictions:
      client.foodRestrictions?.trim() || "None",

    notes:
      "Drink water throughout the day and adjust portions based on energy levels and progress.",
  };
};

module.exports = {
  generateDietData,
};