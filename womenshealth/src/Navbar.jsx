import React from 'react';
import { Link } from 'react-router-dom'; // 1. Added Link to prevent page-reload crashes
import "./Navbar.css";

export default function Navbar() {
  // Ensure it matches your ProtectedRoute variables perfectly:
  const savedToken = localStorage.getItem("authToken");
  const savedRole = localStorage.getItem("userRole");

  return (
    <>
      <nav className="navbar glass">
        
        {/* Logo Element */}
        <div className="logo">
          <img src="/WhImages/lo.png" alt="Logo" className="logo-image" />
        </div>
        <div className="nav-links">
          <Link to="/home">Home</Link>
          <Link to="/calendar">Calendar</Link>
          <Link to="/ask-her">Ask her</Link>
          <Link to="/products">Products</Link>
          <Link to="/tracker">Tracker</Link>
          <Link to="/notes">Notes</Link>
          <Link to="/BookingPage">find a Doctors</Link>
          
          {savedRole === "doctor" && (
            <Link to="/doctor-dashboard">Dashboard</Link>
          )}
          <Link to="/wishlist">Wishlist</Link>
        </div>

      </nav>
    </>
  );
}
