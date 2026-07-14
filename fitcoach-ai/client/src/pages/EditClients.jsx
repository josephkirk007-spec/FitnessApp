import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";
import Navbar from "../components/Navbar.jsx";
import ClientForm from "../components/ClientForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function EditClient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    goal: "",
    fitnessLevel: "",
    workoutDays: "",
    equipment: "",
    dietPreference: "",
    foodRestrictions: "",
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await api.get(`/clients/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        setFormData({
          name: response.data.name || "",
          age: response.data.age || "",
          goal: response.data.goal || "",
          fitnessLevel: response.data.fitnessLevel || "",
          workoutDays: response.data.workoutDays || "",
          equipment: response.data.equipment || "",
          dietPreference: response.data.dietPreference || "",
          foodRestrictions: response.data.foodRestrictions || "",
          notes: response.data.notes || "",
        });
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Unable to load client information."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.token && id) {
      fetchClient();
    }
  }, [id, user]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      setSubmitting(true);

      await api.put(
        `/clients/${id}`,
        {
          ...formData,
          age: Number(formData.age),
          workoutDays: Number(formData.workoutDays),
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      navigate(`/clients/${id}`);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to update the client."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="form-page">
          <p>Loading client...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="form-page">
        <section className="client-form-card">
          <div className="page-heading">
            <div>
              <h1>Edit Client</h1>
              
              <p>Update the client’s fitness and nutrition information.</p>
            </div>

            <Link to={`/clients/${id}`}>Cancel</Link>
          </div>

          {message && <p className="error-message">{message}</p>}

          <ClientForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            submitting={submitting}
            buttonText="Save Changes"
            />
        </section>
      </main>
    </>
  );
}

export default EditClient;