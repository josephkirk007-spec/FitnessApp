import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import ClientForm from "../components/ClientForm";
import { useAuth } from "../context/AuthContext";

function AddClients() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        age: "",
        goal: "",
        fitnessLevel: "",
        workoutDays: "",
        equipment: "",
        dietPreferences: "",
        foodRestrictions: "",
        notes: "",

    });

    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

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

            await api.post(
                "/clients",
                {
                    ...formData,
                    age: Number(formData.age),
                    workoutDays: Number(formData.workoutDays),
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    },
                }
            );

            navigate("/clients");
        } catch (error) {
            console.error("Create Client error", error);

            setMessage(
                error.response?.data?.message ||
                 "Unable to save the client."
            );
            
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
        <Navbar />
        
        <main className="form-page">
            <section className="client-form-card">
                <div className="page-heading">
                    <div>
                        <h1> Add a Client </h1>
                        
                        <p> Enter the infomation needed to create personalized workout and diet plans. </p>
                    </div>

                    <Link to="/clients"> Back to Clients </Link>
                </div>

                {message && <p className="error.message"> {message} </p>}

                <ClientForm
                  formData={formData}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                  submitting={submitting}
                  buttonText="Save Client"
                />
            </section>
        </main>
        
        </>
    );

}

export default AddClients;