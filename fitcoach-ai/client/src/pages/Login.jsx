import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { saveUser } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const { email, password } = formData;

    const handleChange = (event) => {
        setFormData({
             ...formData, 
             [event.target.name]: event.target.value 
            });
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            setMessage("");

            try {
                setLoading(true);

                const response = await api.post("/auth/login", {
                    email: formData.email.trim().toLowerCase(),
                    password: formData.password,
                });

                saveUser(response.data)

                navigate("/dashboard");
            } catch (error) {
                console.error("Login error:", error);

                if (error.response) {
                    setMessage(
                        error.response.data?.message || `Login failed with status ${error.response.status}`
                    );
                } 
                else if (error.request) {
                    setMessage(
                        "Cannot reach the backend. Make sure the server is running on port 5000."
                    );
                } 
                else {
                    setMessage(error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        return (
            <main className="auth-page">
                <section className="auth-card">
                    <h1> Titan Trainer </h1>

                    <p> Coach Portal </p>

                    {message && <p className="error-message">{message} </p>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email"> Email </label>

                            <input
                              id="email"
                              type="email"
                              name="email"
                              value={email}
                              onChange={handleChange}
                              placeholder="Enter Your Email"
                              required
                              />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password"> Password </label>

                            <input
                              id="password"
                              type="password"
                              name="password"
                              value={password}
                              onChange={handleChange}
                              placeholder="Enter Your Password"
                              required
                              />
                        </div>

                        <button type="submit" disabled={loading}>
                            {loading ? "Logging in..." : "Log In"}
                        </button>
                    </form>

                    <p>
                        Need an account? <Link to="/register"> Register </Link>
                    </p>

                    <p className="forgot-password">
                        <Link to="/forgot-password">
                          Forgot your password 
                          </Link>
                    </p>
                </section>
            </main>
        );
    }

            
    export default Login;