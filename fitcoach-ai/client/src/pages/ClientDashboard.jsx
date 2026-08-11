import { useEffect, useState } from "react";
import axios from "axios";

function ClientDashboard() {
  const [client, setClient] = useState(null);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [dietPlans, setDietPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPortal = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const token =
          user?.token ||
          localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/v1/portal/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setClient(response.data.client);
        setWorkoutPlans(response.data.workoutPlans || []);
        setDietPlans(response.data.dietPlans || []);
      } catch (error) {
        console.error("CLIENT PORTAL ERROR:", error);

        setMessage(
          error.response?.data?.message ||
            "Unable to load your plans."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPortal();
  }, []);

  if (loading) {
    return <p>Loading your Titan plans...</p>;
  }

  return (
    <main className="client-dashboard">
      <section className="client-dashboard-header">
        <h1>
          Welcome{client?.name ? `, ${client.name}` : ""}
        </h1>

        <p>
          View the workout and nutrition plans your coach
          created for you.
        </p>
      </section>

      {message && (
        <p className="error-message">
          {message}
        </p>
      )}

      {client && (
        <section className="client-profile-card">
          <h2>Your Fitness Profile</h2>

          <p>
            <strong>Goal:</strong>{" "}
            {client.goal || "Not provided"}
          </p>

          <p>
            <strong>Fitness Level:</strong>{" "}
            {client.fitnessLevel || "Not provided"}
          </p>

          <p>
            <strong>Workout Days:</strong>{" "}
            {client.workoutDays || 0} per week
          </p>

          <p>
            <strong>Diet Preference:</strong>{" "}
            {client.dietPreference || "Not provided"}
          </p>

          <p>
            <strong>Food Restrictions:</strong>{" "}
            {client.foodRestrictions || "None"}
          </p>
        </section>
      )}

      <section className="client-plan-section">
        <h2>My Workout Plans</h2>

        {workoutPlans.length === 0 ? (
          <p>
            Your coach has not assigned a workout plan yet.
          </p>
        ) : (
          workoutPlans.map((plan) => (
            <article
              className="client-plan-card"
              key={plan._id}
            >
              <h3>{plan.title}</h3>

              <p>
                <strong>Length:</strong>{" "}
                {plan.weeks} weeks
              </p>

              <p>
                <strong>Training Days:</strong>{" "}
                {plan.workoutDays} per week
              </p>

              {Array.isArray(plan.exercises) &&
                plan.exercises.map((day, index) => (
                  <div
                    className="client-workout-day"
                    key={`${plan._id}-${index}`}
                  >
                    <h4>
                      {day.day || `Day ${index + 1}`}
                    </h4>

                    {day.focus && (
                      <p>
                        <strong>Focus:</strong>{" "}
                        {day.focus}
                      </p>
                    )}

                    <ul>
                      {(day.workout || []).map(
                        (exercise, exerciseIndex) => (
                          <li
                            key={`${plan._id}-${index}-${exerciseIndex}`}
                          >
                            {typeof exercise === "string"
                              ? exercise
                              : exercise.name ||
                                "Exercise"}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                ))}
            </article>
          ))
        )}
      </section>

      <section className="client-plan-section">
        <h2>My Diet Plans</h2>

        {dietPlans.length === 0 ? (
          <p>
            Your coach has not assigned a diet plan yet.
          </p>
        ) : (
          dietPlans.map((plan) => (
            <article
              className="client-plan-card"
              key={plan._id}
            >
              <h3>{plan.title}</h3>

              <div className="client-macro-grid">
                <p>
                  <strong>Calories:</strong>{" "}
                  {plan.dailyCalories}
                </p>

                <p>
                  <strong>Protein:</strong>{" "}
                  {plan.protein}g
                </p>

                <p>
                  <strong>Carbs:</strong>{" "}
                  {plan.carbs}g
                </p>

                <p>
                  <strong>Fat:</strong>{" "}
                  {plan.fat}g
                </p>
              </div>

              {Array.isArray(plan.meals) &&
                plan.meals.map((meal, index) => (
                  <div
                    className="client-meal-card"
                    key={`${plan._id}-${index}`}
                  >
                    <h4>
                      {meal.mealName ||
                        `Meal ${index + 1}`}
                    </h4>

                    <ul>
                      {(meal.foods || []).map(
                        (food, foodIndex) => (
                          <li
                            key={`${plan._id}-${index}-${foodIndex}`}
                          >
                            {food}
                          </li>
                        )
                      )}
                    </ul>

                    <p>
                      Calories:{" "}
                      {meal.calories ??
                        meal.estimatedCalories ??
                        0}
                    </p>

                    <p>
                      Macros: {meal.protein || 0}g
                      protein, {meal.carbs || 0}g
                      carbs, {meal.fat || 0}g fat
                    </p>
                  </div>
                ))}
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default ClientDashboard;