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
      const response = await fetch("http://localhost:3000/api/auth/signin", {
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
      
      // 💡 THE CRITICAL CHECK: Use data.user?.role (with the question mark)
      // Your backend structure wraps user properties inside a nested "user" object block!
      const userRole = data.user?.role || "user"; 
      localStorage.setItem("userRole", userRole);

      // 2. Clear state locks and route based on the payload role
      if (userRole === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/home");
      }

    } catch (err) {
      // 💡 If something breaks, render it visually to the user profile screen box banner 
      setError(err.message || "An unexpected error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="auth-wrapper">
      <main className="auth-card">
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
              {/* Updated to navigate directly to the signup path */}
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
      </main>
    </div>
  );
}
