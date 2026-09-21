import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./index.css";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate(); // Initialize navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all layout text fields.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://32.198.180", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid username or password match.");
      }

      // 1. Save credentials to storage
      localStorage.setItem("authToken", data.token);
      const userRole = data.user?.role || "user"; 
      localStorage.setItem("userRole", userRole);
      if (userRole === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/home");
      }

    } catch (err) {
      setError(err.message || "An unexpected error occurred during login.");
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
            <p className="brand-subtitle">Log in to track your personal wellness journey</p>
          </header>

          {error && (
            <div className="server-banner error" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-transition-container">
              <div className="input-group">
                <label htmlFor="login-email">Email Address</label>
                <div className="input-field-wrapper">
                  <input
                    id="login-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="login-password">Password</label>
                <div className="input-field-wrapper">
                  <input
                    id="login-password"
                    type="password"
                    placeholder="Enter your security password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="primary-auth-btn" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Log In"}
            </button>

            <footer className="auth-card-footer">
              <p>
                Don't have an account?{" "}
                <button 
                  type="button" 
                  onClick={() => navigate("/signup")} 
                  className="subview-toggle-link"
                >
                  Create Account
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