import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import Navbar from "../components/Navbar.jsx";
import WorkoutPlanCard from "../components/WorkoutPlanCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function SavedPlans() {
  const { user } = useAuth();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      try {
        setLoading(true);
        setMessage("");

        const response = await api.get("/workouts", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        setPlans(response.data);
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
      fetchWorkoutPlans();
    }
  }, [user]);

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

        {!loading && !message && plans.length === 0 && (
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

        {!loading && plans.length > 0 && (
          <section className="plans-list">
            {plans.map((plan) => (
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