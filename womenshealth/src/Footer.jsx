import React from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css"; 

export default function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-container">
        
        {/* Brand Information Section */}
        <div className="footer-section brand-info">
          <h2 className="footer-logo">Women's Health</h2>
          <p className="footer-tagline">
            Your trusted companion for personal wellness, cycle tracking, and expert medical guidance.
          </p>
        </div>

        {/* Quick Navigation Links */}
        <div className="footer-section footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li onClick={() => navigate("/home")}>Dashboard</li>
            <li onClick={() => navigate("/tracker")}>Wellness Tracker</li>
            <li onClick={() => navigate("/products")}>Products Area</li>
            <li onClick={() => navigate("/ask-her")}>Ask Her AI</li>
          </ul>
        </div>

        {/* Feature Areas Links */}
        <div className="footer-section footer-links">
          <h3>Features</h3>
          <ul>
            <li onClick={() => navigate("/calendar")}>Interactive Calendar</li>
            <li onClick={() => navigate("/notes")}>Personal Notes</li>
            <li onClick={() => navigate("/doctor-dashboard")}>Medical Center</li>
          </ul>
        </div>

        {/* Contact/Support Info */}
        <div className="footer-section footer-contact">
          <h3>Support Center</h3>
          <p>Need assistance with your account?</p>
          <a href="mailto:support@womenshealth.com" className="footer-email">
            support@womenshealth.com
          </a>
        </div>

      </div>

      {/* Underline Copyright Banner */}
      <div className="footer-bottom">
        <p>&copy; {currentYear} Women's Health Project. All rights reserved.</p>
      </div>
    </footer>
  );
}
