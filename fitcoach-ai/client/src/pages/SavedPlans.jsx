import { useEffect, useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";
import WorkoutPlanCard from "../components/WorkoutPlanCard";
import DietPlanCard from "../components/DietPlanCard";
import { useAuth } from "../context/AuthContext";

function SavedPlans() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const selectedType =
    searchParams.get("type") === "diet"
      ? "diet"
      : "workout";

  const [workoutPlans, setWorkoutPlans] =
    useState([]);

  const [dietPlans, setDietPlans] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      if (!user?.token) {
        setMessage("Please log in again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setMessage("");

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const results =
          await Promise.allSettled([
            api.get("/workouts", config),
            api.get("/diets", config),
          ]);

        const workoutResult = results[0];
        const dietResult = results[1];

        if (
          workoutResult.status ===
          "fulfilled"
        ) {
          const responseData =
            workoutResult.value.data;

          const workouts =
            Array.isArray(responseData)
              ? responseData
              : responseData?.workoutPlans ||
                responseData?.plans ||
                [];

          setWorkoutPlans(workouts);

          console.log(
            "WORKOUT PLANS:",
            workouts
          );
        } else {
          console.error(
            "WORKOUT REQUEST FAILED:",
            workoutResult.reason
              ?.response?.data ||
              workoutResult.reason
          );

          setWorkoutPlans([]);
        }

        if (
          dietResult.status ===
          "fulfilled"
        ) {
          const responseData =
            dietResult.value.data;

          const diets =
            Array.isArray(responseData)
              ? responseData
              : responseData?.dietPlans ||
                responseData?.plans ||
                [];

          setDietPlans(diets);

          console.log(
            "DIET PLANS:",
            diets
          );
        } else {
          console.error(
            "DIET REQUEST FAILED:",
            dietResult.reason
              ?.response?.data ||
              dietResult.reason
          );

          setDietPlans([]);
        }

        const failedRequests =
          results.filter(
            (result) =>
              result.status === "rejected"
          );

        if (failedRequests.length === 2) {
          setMessage(
            "Unable to load workout and diet plans."
          );
        } else if (
          failedRequests.length === 1
        ) {
          setMessage(
            "One type of saved plan could not be loaded."
          );
        }
      } catch (error) {
        console.error(
          "SAVED PLANS ERROR:",
          error
        );

        setMessage(
          error.response?.data?.message ||
            "Unable to load saved plans."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [user?.token]);

  const plansToDisplay =
    selectedType === "diet"
      ? dietPlans
      : workoutPlans;

      const handleDeletePlan = async (planId) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete this ${selectedType} plan?`
  );

  if (!confirmed) return;

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const endpoint =
      selectedType === "diet"
        ? `/diets/${planId}`
        : `/workouts/${planId}`;

    await api.delete(endpoint, config);

    if (selectedType === "diet") {
      setDietPlans((currentPlans) =>
        currentPlans.filter(
          (plan) => plan._id !== planId
        )
      );
    } else {
      setWorkoutPlans((currentPlans) =>
        currentPlans.filter(
          (plan) => plan._id !== planId
        )
      );
    }

    setMessage(
      `${
        selectedType === "diet"
          ? "Diet"
          : "Workout"
      } plan deleted successfully.`
    );
  } catch (error) {
    console.error("DELETE PLAN ERROR:", error);

    setMessage(
      error.response?.data?.message ||
        "Unable to delete the plan."
    );
  }
};

const handleUpdatePlan = async (
  planId,
  updatedData
) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const endpoint =
      selectedType === "diet"
        ? `/diets/${planId}`
        : `/workouts/${planId}`;

    const response = await api.put(
      endpoint,
      updatedData,
      config
    );

    if (selectedType === "diet") {
      setDietPlans((currentPlans) =>
        currentPlans.map((plan) =>
          plan._id === planId
            ? response.data
            : plan
        )
      );
    } else {
      setWorkoutPlans((currentPlans) =>
        currentPlans.map((plan) =>
          plan._id === planId
            ? response.data
            : plan
        )
      );
    }

    setMessage(
      `${
        selectedType === "diet"
          ? "Diet"
          : "Workout"
      } plan updated successfully.`
    );
  } catch (error) {
    console.error("UPDATE PLAN ERROR:", error);

    setMessage(
      error.response?.data?.message ||
        "Unable to update the plan."
    );
  }
};

  return (
    <>
      <Navbar />

      <main className="plans-page">
        <div className="page-heading">
          <h1>
            Saved{" "}
            {selectedType === "diet"
              ? "Diet"
              : "Workout"}{" "}
            Plans
          </h1>

          <p>
            Review the plans generated for
            your clients.
          </p>

          <div className="plan-tabs">
            <Link
              to="/saved-plans?type=workout"
              className={
                selectedType === "workout"
                  ? "plan-tab active-plan-tab"
                  : "plan-tab"
              }
            >
              Workout Plans
            </Link>

            <Link
              to="/saved-plans?type=diet"
              className={
                selectedType === "diet"
                  ? "plan-tab active-plan-tab"
                  : "plan-tab"
              }
            >
              Diet Plans
            </Link>
          </div>
        </div>

        {loading && (
          <p className="loading-message">
            Loading{" "}
            {selectedType === "diet"
              ? "diet"
              : "workout"}{" "}
            plans...
          </p>
        )}

        {message && (
          <p className="error-message">
            {message}
          </p>
        )}

        {!loading &&
          plansToDisplay.length === 0 && (
            <section className="empty-state">
              <h2>
                No saved{" "}
                {selectedType === "diet"
                  ? "diet"
                  : "workout"}{" "}
                plans yet
              </h2>

              <p>
                Open a client profile and
                generate a plan first.
              </p>

              <Link
                className="primary-link"
                to="/clients"
              >
                View Clients
              </Link>
            </section>
          )}

        {!loading &&
          plansToDisplay.length > 0 && (
            <section className="plans-list">
              {plansToDisplay.map(
                (plan) =>
                  selectedType ===
                  "diet" ? (
                    <DietPlanCard
                      key={plan._id}
                      plan={plan}
                      onDelete={handleDeletePlan}
                      onUpdate={handleUpdatePlan}
                    />
                  ) : (
                    <WorkoutPlanCard
                      key={plan._id}
                      plan={plan}
                      onDelete={handleDeletePlan}
                      onUpdate={handleUpdatePlan}
                    />
                  )
              )}
            </section>
          )}
      </main>
    </>
  );
}

export default SavedPlans;