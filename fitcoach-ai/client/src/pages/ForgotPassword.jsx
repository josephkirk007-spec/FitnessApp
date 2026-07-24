import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setIsError(false);

    if (
      !formData.email ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setIsError(true);
      setMessage("Please fill in every field.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setIsError(true);
      setMessage(
        "Your new password must contain at least 6 characters."
      );
      return;
    }

    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      setIsError(true);
      setMessage("The passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.put(
        "/auth/reset-password",
        {
          email: formData.email,
          newPassword: formData.newPassword,
          confirmPassword:
            formData.confirmPassword,
        }
      );

      setMessage(response.data.message);
      setIsError(false);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setIsError(true);
      setMessage(
        error.response?.data?.message ||
          "Unable to reset your password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Reset Password</h1>

        <p>
          Enter your account email and choose a new
          password.
        </p>

        {message && (
          <p
            className={
              isError
                ? "error-message"
                : "success-message"
            }
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">
              Account email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">
              New password
            </label>

            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter a new password"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading
              ? "Resetting password..."
              : "Reset Password"}
          </button>
        </form>

        <p>
          <Link to="/login">
            Return to login
          </Link>
        </p>
      </section>
    </main>
  );
}

export default ForgotPassword;