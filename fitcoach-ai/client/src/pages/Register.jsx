import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const { name, email, password, confirmPassword } = formData;

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

        const response = await api.post("/auth/register", {
            name,
            email,
            password,
        });

        localStorage.setItem("user", JSON.stringify(response.data.token));

        navigate("/dashboard");
    } catch (error) {
        setMessage(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
        setLoading(false);
    }
};

return (
    <main className="auth-page">
        <section className="auth-form">
            <h1> Create Coach Account </h1>

            <p> Register to manage clients and create fitness plans.</p>
            {message && <p className="error-message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name"> Coach Name </label>
                    <input 
                    id="name"
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email"> Email </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        placeholder="Enter your email"
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
                        placeholder="Enter your password"
                        minLength={6}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword"> Confirm Password </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        minLength={6}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Creating Account..." : "Register"}
                </button>
            </form>

            <p> Already registered? <Link to="/login"> Log In</Link> </p>
        </section>
    </main>
);
}

export default Register;