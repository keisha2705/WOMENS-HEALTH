import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import "./index.css";

export default function SignUp() { // Removed prop
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // 2. Initialize navigate hook

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {                                                                
    let currentErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) currentErrors.name = "Full name is required";
    if (!formData.email) {
      currentErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      currentErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      currentErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      currentErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      currentErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage({ type: "", text: "" });

    // 💡 THE CRITICAL BYPASS: Log an alert to see if the form gets stuck inside validation rules
    if (!validateForm()) {
      console.warn("Form validation rejected your inputs! Check the field error strings.");
      return; 
    }
    
    setIsLoading(true);

    try {
      console.log("Form passed validation! Dispatching payload to MongoDB now...", formData);

      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          role: "user" 
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Registration error occurred while writing to MongoDB.");
      }

      console.log("User successfully written to MongoDB Atlas collection documents!", data);
      setServerMessage({ type: "success", text: "Account created successfully! Redirecting to login..." });
      
      setTimeout(() => {
        navigate("/signin");
      }, 2000);

    } catch (err) {
      console.error("Database connection failure flag:", err);
      setServerMessage({ type: "error", text: err.message || "Could not reach the database server." });
    } finally {
      setIsLoading(false);
    }
  };


   return (
    <div className="auth-fullscreen-container">
      
      <section className="auth-form-column">
        <div className="auth-form-workspace">
          
          <header className="auth-logo-area">
            <h1 className="brand-name">Women's Health</h1>
            <p className="brand-subtitle">Create an account to begin your wellness journey</p>
          </header>

          {serverMessage.text && (
            <div className={`server-banner ${serverMessage.type}`} role="alert">
              {serverMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-transition-container">
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-field-wrapper">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Keisha Moyo"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.name && <span className="field-error-text" role="alert">{errors.name}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-field-wrapper">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.email && <span className="field-error-text" role="alert">{errors.email}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <div className="input-field-wrapper">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.password && <span className="field-error-text" role="alert">{errors.password}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-field-wrapper">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.confirmPassword && <span className="field-error-text" role="alert">{errors.confirmPassword}</span>}
              </div>
            </div>

            <button type="submit" className="primary-auth-btn" disabled={isLoading}>
              {isLoading ? <span className="spinner"></span> : "Create Account"}
            </button>

            <footer className="auth-card-footer">
              <p>
                Already have an account?{" "}
                <button type="button" onClick={() => navigate("/signin")} className="subview-toggle-link">
                  Log In
                </button>
              </p>
            </footer>
          </form>
          
        </div>
      </section>
      <section className="auth-editorial-column">
        <div className="editorial-overlay-content">
          <span className="editorial-tag">Platform Access</span>
          
          <h2 className="editorial-heading">
            Track your cycles with absolute diagnostic clarity.
          </h2>
          
          <p className="editorial-description">
            Log physical parameters, map symptoms, evaluate reproductive metrics side-by-side, 
            and synchronize automated calendar events within a secure, high-utility dashboard workspace.
          </p>

          <div className="editorial-image-box">
            <img 
              src="/WhImages/lo.png" 
              alt="Minimal reproductive cycle metric line chart rendering demonstration" 
              className="editorial-showcase-img"
            />
          </div>

          <div className="editorial-footer-metrics">
            <div className="auth-stat-node">
              <strong>100%</strong>
              <small>private data isolation</small>
            </div>
            <div className="auth-stat-node">
              <strong>28 days</strong>
              <small>smart cycle tracking loops</small>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
