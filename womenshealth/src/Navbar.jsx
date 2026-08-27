import React from 'react';
import { Link } from 'react-router-dom'; // 1. Added Link to prevent page-reload crashes
import "./Navbar.css";

export default function Navbar() {
  // Ensure it matches your ProtectedRoute variables perfectly:
  const savedToken = localStorage.getItem("authToken");
  const savedRole = localStorage.getItem("userRole");

  return (
    <>
      {/* Kept your exact classes: navbar and glass */}
      <nav className="navbar glass">
        
        {/* Logo Element */}
        <div className="logo">
          <img src="/WhImages/lo.png" alt="Logo" className="logo-image" />
        </div>

        {/* Navigation Options Links — Swapped 'a href' for 'Link to' with your exact selectors */}
        <div className="nav-links">
          <Link to="/home">Home</Link>
          <Link to="/calendar">Calendar</Link>
          <Link to="/ask-her">Ask her</Link>
          <Link to="/products">Products</Link>
          <Link to="/tracker">Tracker</Link>
          <Link to="/notes">Notes</Link>
          
          {/* 🛠️ FIXED: Swapped 'userRole' out for your actual variable 'savedRole' */}
          {savedRole === "doctor" && (
            <Link to="/doctor-dashboard">Dashboard</Link>
          )}
          
          <Link to="/landing">About Us</Link>
          <Link to="/home">User Profile</Link>
        </div>

      </nav>
    </>
  );
}
