import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
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
        dietPreference: "",
        foodRestrictions: "",
        notes: "",

    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setFormData({...formData, [event.target.name]: event.taget.value,
        });
    };

    const handleSubmit = async (event) => {
        event.PreventDefault();
        setMessage("");

        try {
            setLoading(true);

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

            if(error.response) {
                setMessage(
                    error.response.data?.message || `Server error: ${error.response.status}`
                );
            } else if(error.request) {
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

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="name"> Client Name </label>

                            <input 
                              id="name"
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Enter Client Name"
                              required
                              />
                        </div>

                        <div className="form-group">
                            <label htmlFor="age"> Age </label>

                            <input 
                              id="age"
                              type="number"
                              name="age"
                              value={formData.age}
                              onChange={handleChange}
                              min="13"
                              max="100"
                              placeholder="Enter Age"
                              required
                              />
                        </div>

                        <div className="form-group">
                            <label htmlFor="goal"> Fitness Goal </label>

                            <select
                              id="goal"
                              name="goal"
                              value={formData.goal}
                              onChange={handleChange}
                              required
                              >
                                <option value=""> Select a Goal </option>
                                <option value="Lose body fat"> Lose Body Fat </option>
                                <option value="Gain muscle"> Gain Muscle </option>
                                <option value="Improve strength"> Improve Strength </option>
                                <option value="Improve endurance"> Improve Endurance </option>
                                <option value="General fitness"> General Fitness </option>
                            </select>
                        </div>


                        <div className="form-group">
                            <label htmlFor="fitnessLevel"> Fitness Level </label>
                                 
                            <select
                                id="fitnessLevel"
                                name="fitnessLevel"
                                value={formData.fitnessLevel}
                                onChange={handleChange}
                                required
                             >
                                <option value=""> Select a Level </option>
                                <option value="Beginner"> Beginner </option>
                                <option value="Intermediate"> Intermediate </option>
                                <option value="Advanced"> Advanced </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="workoutDays"> Workout Days </label>

                            <input
                                id="workoutDays"
                                type="number"
                                name="workoutDays"
                                value={formData.workoutDays}
                                onChange={handleChange}
                                min="1"
                                max="7"
                                placeholder="Example: 4"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="equipment"> Equipment </label>

                            <select
                                id="equipment"
                                name="equipment"
                                value={formData.equipment}
                                onChange={handleChange}
                                required
                             >
                                <option value=""> Select Equipment </option>
                                <option value="Full gym"> Full Gym </option>
                                <option value="Home gym"> Home Gym </option>
                                <option value="Dumbbells only"> Dumbbells Only </option>
                                <option value="Resistance bands"> Resistance Bands </option>
                                <option value="No equipment"> No Equipment </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="dietPreference"> Diet Preference </label>

                                <select
                                    id="dietPreference"
                                    name="dietPreference"
                                    value={formData.dietPreference}
                                    onChange={handleChange}
                                    required
                                 >
                                    <option value=""> Select a Diet </option>
                                    <option value="High Protein"> High-Protein Diet </option>
                                    <option value="Keto"> Keto Diet </option>
                                    <option value="Vegan"> Vegan Diet </option>
                                    <option value="Vegatarian"> Vegatarian Diet </option>
                                    <option value="Low carbs"> Low-Carbs Diet </option>
                                    <option value="Mediterranean"> Mediterranean Diet </option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="foodRestrictions"> Allergies to Avoid </label>
                                            
                                <input 
                                    id="foodRestrictions"
                                    type="text"
                                    name="foodRestrictions"
                                    value={formData.foodRestrictions}
                                    onChange={handleChange}
                                    placeholder="Example: dairy, peanuts"
                                 />
                            </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="notes"> Coach Notes </label>

                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows="5"
                                placeholder="Add relevant client notes"
                            />
                    </div>

                    <button type="submit" disabled={loading}>
                      {loading ? "Saving Client..." : "Save Client"}
                    </button>

                </form>
            </section>
        </main>
        
        </>
    );

}

export default AddClients;