import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import Navbar from "../components/Navbar.jsx";
import PlanCard from "../components/PlanCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function Plans() {
  const { user } = useAuth();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setMessage("");

        const response = await api.get("/plans", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        setPlans(response.data);
      } catch (error) {
        console.error("Fetch plans error:", error);

        if (error.response) {
          setMessage(
            error.response.data?.message ||
              `Server error: ${error.response.status}`
          );
        } else if (error.request) {
          setMessage(
            "Cannot reach the backend. Make sure your server is running."
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
  }, [user]);

  return (
    <>
      <Navbar />

      <main className="plans-page">
        <div className="page-heading">
          <div>
            <h1>Saved Plans</h1>

            <p>
              Review workout and nutrition plans created for your clients.
            </p>
          </div>

          <Link className="primary-link" to="/clients">
            Choose a Client
          </Link>
        </div>

        {loading && <p>Loading saved plans...</p>}

        {message && (
          <p className="error-message">{message}</p>
        )}

        {!loading && !message && plans.length === 0 && (
          <section className="empty-state">
            <h2>No saved plans yet</h2>

            <p>
              Select a client and generate a fitness plan to see it here.
            </p>

            <Link className="primary-link" to="/clients">
              View Clients
            </Link>
          </section>
        )}

        {!loading && plans.length > 0 && (
          <section className="plans-list">
            {plans.map((plan) => (
              <PlanCard key={plan._id} plan={plan} />
            ))}
          </section>
        )}
      </main>
    </>
  );
}

export default Plans;