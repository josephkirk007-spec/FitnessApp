import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api.js";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function ClientDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        setMessage("");

        const response = await api.get(`/clients/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        setClient(response.data);
      } catch (error) {
        console.error("Fetch client error:", error);

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

    if (user?.token && id) {
      fetchClient();
    }
  }, [id, user]);

  return (
    <>
      <Navbar />

      <main className="client-details-page">
        <div className="page-heading">
          <div>
            <h1>Client Details</h1>
            <p>Review the client’s fitness and nutrition profile.</p>
          </div>

          <Link to="/clients">Back to Clients</Link>
        </div>

        {loading && <p>Loading client...</p>}

        {message && <p className="error-message">{message}</p>}

        {!loading && !message && client && (
          <>
            <section className="client-profile-card">
              <div className="client-profile-header">
                <div>
                  <h2>{client.name}</h2>
                  <p>{client.goal}</p>
                </div>

                <span className="client-level">
                  {client.fitnessLevel}
                </span>
              </div>

              <div className="client-profile-grid">
                <div>
                  <span>Age</span>
                  <strong>{client.age}</strong>
                </div>

                <div>
                  <span>Workout days</span>
                  <strong>{client.workoutDays} per week</strong>
                </div>

                <div>
                  <span>Equipment</span>
                  <strong>{client.equipment}</strong>
                </div>

                <div>
                  <span>Diet preference</span>
                  <strong>{client.dietPreference}</strong>
                </div>

                <div>
                  <span>Food restrictions</span>
                  <strong>
                    {client.foodRestrictions || "None"}
                  </strong>
                </div>

                <div>
                  <span>Created</span>
                  <strong>
                    {new Date(client.createdAt).toLocaleDateString()}
                  </strong>
                </div>
              </div>

              <div className="client-notes">
                <h3>Coach Notes</h3>

                <p>{client.notes || "No notes added."}</p>
              </div>
            </section>

            <section className="client-actions">
              <Link
                className="secondary-link"
                to={`/clients/${client._id}/edit`}
              >
                Edit Client
              </Link>

              <button type="button">
                Generate Fitness Plan
              </button>
            </section>
          </>
        )}
      </main>
    </>
  );
}

export default ClientDetails;