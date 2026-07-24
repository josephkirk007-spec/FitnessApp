import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import Navbar from "../components/Navbar.jsx";
import WorkoutPlanCard from "../components/WorkoutPlanCard.jsx";
import DietPlanCard from "../components/DietPlanCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useSearchParams } from "react-router-dom";

function SavedPlans() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const selectedType = 
    searchParams.get("type") === "diet"
      ? "diet"
      : "workout";
      
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [dietPlans, setDietPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      if(!user?.token) return;

      try {
        setLoading(true);
        setMessage("");

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        
        const [workoutResponse, dietResponse] =
         await Promise.all([
          api.get("/workouts", config),
          api.get("/diets", config),
         ]);

         const workoutData = Array.isArray(
          workoutResponse
         )
           ? workoutResponse
           : workoutResponse.data?.workoutPlans ||
           workoutResponse.data?.plans || [];

        const dietData = Array.isArray(
          dietResponse.data
        )
          ? dietResponse
          : dietResponse.data?.dietPlans ||
           dietResponse.data?.plans || [];

        setWorkoutPlans(workoutData);
        setDietPlans(dietData);

      } catch (error) {
        console.error("Fetch workout plans error:", error);

        if (error.response) {
          setMessage(
            error.response.data?.message ||
              `Server error: ${error.response.status}`
          );
        } else if (error.request) {
          setMessage(
            "Cannot reach the backend. Make sure the server is running."
          );
        } else {
          setMessage(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchPlans();
    }
  }, [user?.token]);

  const handleDeletePlan = async (planId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this workout plan?"
    );

    if(!confirmed) {
      return;
    }

    try {
      setMessage("");

      await api.delete(`/workouts/${planId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setPlans((currentPlans) => 
        currentPlans.filter((plan) => plan._id !== planId)
      );
    } catch (error) {
       console.error("Delete workout plan error:", error);

       setMessage(
        error.response?.data?.message || "Unable to delete the workout plan."
       );
    }
  };

  const handleUpdatePlan = async (plan) => {
  const newTitle = window.prompt(
    "Enter a new plan title:",
    plan.title
  );

  if (!newTitle || newTitle.trim() === "") {
    return;
  }

  try {
    setMessage("");

    const response = await api.put(
      `/workouts/${plan._id}`,
      {
        title: newTitle.trim(),
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    setPlans((currentPlans) =>
      currentPlans.map((currentPlan) =>
        currentPlan._id === plan._id
          ? {
              ...currentPlan,
              ...response.data,
              client: currentPlan.client,
            }
          : currentPlan
      )
    );
  } catch (error) {
    console.error("Update workout plan error:", error);

    setMessage(
      error.response?.data?.message ||
        "Unable to update the workout plan."
    );
  }
};

const plansToDisplay =
  selectedType === "diet"
    ? dietPlans
    :workoutPlans;

  return (
    <>
      <Navbar />

      <main className="plans-page">
        <div className="page-heading">
          <div>
            <h1>Saved Titan Plans</h1>

            <p>
              Review all workout plans generated for your clients.
            </p>
          </div>

          <Link className="primary-link" to="/clients">
            Choose a Client
          </Link>
        </div>

        {loading && <p>Loading workout plans...</p>}

        {message && (
          <p className="error-message">{message}</p>
        )}

        {!loading && !message && plansToDisplay.length === 0 && (
          <section className="empty-state">
            <h2>No saved workout plans yet</h2>

            <p>
              Open a client profile and generate a Titan Plan.
            </p>

            <Link className="primary-link" to="/clients">
              View Clients
            </Link>
          </section>
        )}

        {!loading && plansToDisplay.length > 0 && (
          <section className="plans-list">
            {plansToDisplay.map((plan) =>
              selectedType === "diet"
                ? (
                  <DietPlanCard
                    key={plan._id}
                    plan={plan}
                    onDelete={handleDeletePlan}
                    onUpdate={handleUpdatePlan}
                    />
                )
                : (
                  <WorkoutPlanCard
                    key={plan._id}
                    plan={plan}
                    onDelete={handleDeletePlan}
                    onUpdate={handleUpdatePlan}
                  />
            ))}
          </section>
        )}
      </main>
    </>
  );
}

export default SavedPlans;