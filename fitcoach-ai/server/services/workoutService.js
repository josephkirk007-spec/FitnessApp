const getGoalExercise = (goal) => {
  const goalExercises = {
    "Lose body fat": "Cardio intervals: 15-20 minutes",
    "Gain muscle": "Accessory exercise: 3 sets of 10-12 reps",
    "Improve strength": "Main strength movement: 4 sets of 5-8 reps",
    "Improve endurance": "Steady cardio: 20-30 minutes",
    "General fitness": "Moderate cardio or mobility: 15 minutes",
  };

  return goalExercises[goal] || "Moderate cardio: 15 minutes";
};

const workoutLibrary = {
  Beginner: {
    "Full gym": [
      "Leg press: 3 sets of 10",
      "Machine chest press: 3 sets of 10",
      "Seated cable row: 3 sets of 10",
      "Stationary bike: 15 minutes",
    ],

    "Home gym": [
      "Goblet squats: 3 sets of 10",
      "Dumbbell chest press: 3 sets of 10",
      "One-arm dumbbell rows: 3 sets of 10 per side",
      "Brisk walk or bike: 15 minutes",
    ],

    "Dumbbells only": [
      "Goblet squats: 3 sets of 10",
      "Dumbbell floor press: 3 sets of 10",
      "Dumbbell rows: 3 sets of 10",
      "Dumbbell Romanian deadlifts: 3 sets of 10",
    ],

    "Resistance bands": [
      "Band squats: 3 sets of 12",
      "Band chest press: 3 sets of 10",
      "Band rows: 3 sets of 12",
      "Band pull-aparts: 3 sets of 15",
    ],

    "No equipment": [
      "Bodyweight squats: 3 sets of 10",
      "Incline push-ups: 3 sets of 8",
      "Glute bridges: 3 sets of 12",
      "Plank: 3 rounds of 20 seconds",
    ],
  },

  Intermediate: {
    "Full gym": [
      "Barbell squats: 4 sets of 8",
      "Bench press: 4 sets of 8",
      "Lat pulldowns: 4 sets of 10",
      "Romanian deadlifts: 3 sets of 10",
    ],

    "Home gym": [
      "Dumbbell front squats: 4 sets of 10",
      "Dumbbell bench press: 4 sets of 8",
      "Renegade rows: 3 sets of 8 per side",
      "Dumbbell lunges: 3 sets of 10 per leg",
    ],

    "Dumbbells only": [
      "Dumbbell squats: 4 sets of 10",
      "Dumbbell shoulder press: 4 sets of 8",
      "Dumbbell rows: 4 sets of 10",
      "Walking lunges: 3 sets of 12 per leg",
    ],

    "Resistance bands": [
      "Banded split squats: 4 sets of 10",
      "Band chest press: 4 sets of 12",
      "Band rows: 4 sets of 12",
      "Band Romanian deadlifts: 4 sets of 10",
    ],

    "No equipment": [
      "Jump squats: 4 sets of 10",
      "Push-ups: 4 sets of 10",
      "Reverse lunges: 3 sets of 12 per leg",
      "Mountain climbers: 4 rounds of 30 seconds",
    ],
  },

  Advanced: {
    "Full gym": [
      "Barbell back squats: 5 sets of 5",
      "Bench press: 5 sets of 5",
      "Deadlifts: 4 sets of 5",
      "Pull-ups: 4 sets",
    ],

    "Home gym": [
      "Heavy dumbbell squats: 5 sets of 8",
      "Dumbbell bench press: 5 sets of 8",
      "Single-leg Romanian deadlifts: 4 sets of 10",
      "Renegade rows: 4 sets of 10",
    ],

    "Dumbbells only": [
      "Dumbbell thrusters: 4 sets of 10",
      "Bulgarian split squats: 4 sets of 10 per leg",
      "Dumbbell rows: 5 sets of 8",
      "Dumbbell Romanian deadlifts: 5 sets of 8",
    ],

    "Resistance bands": [
      "Heavy band squats: 5 sets of 12",
      "Band-resisted push-ups: 4 sets of 12",
      "Heavy band rows: 5 sets of 12",
      "Band deadlifts: 5 sets of 10",
    ],

    "No equipment": [
      "Pistol-squat progression: 4 sets per leg",
      "Decline push-ups: 4 sets of 12",
      "Jumping lunges: 4 sets of 12 per leg",
      "Burpees: 5 rounds of 10",
    ],
  },
};

const generateWorkoutData = (client) => {
  const selectedExercises =
    workoutLibrary[client.fitnessLevel]?.[client.equipment] ||
    workoutLibrary.Beginner["No equipment"];

  const goalExercise = getGoalExercise(client.goal);

  const exercises = [];

  for (let day = 1; day <= client.workoutDays; day += 1) {
    exercises.push({
      day: `Day ${day}`,
      workout: [
        "Warm-up: 5-10 minutes",
        ...selectedExercises,
        goalExercise,
        "Cool-down and stretching: 5-10 minutes",
      ],
    });
  }

  return {
    title: `${client.name}'s ${client.goal} Titan Plan`,
    weeks: 4,
    workoutDays: client.workoutDays,
    exercises,
    notes:
      "Use controlled form, increase difficulty gradually, and allow time for recovery.",
  };
};

module.exports = {
  generateWorkoutData,
};