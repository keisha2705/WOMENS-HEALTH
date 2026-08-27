import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth & Public Layouts
import SignIn from "./SignIn.jsx";
import SignUp from "./Signup.jsx";
import LandingPage from "./LandingPage.jsx";
import Homepage from "./Homepage.jsx";
import ErrorPage from "./ErrorPage.jsx";
import DoctorsDashboard from "./DoctorsDashboard.jsx";
import Tracker from "./Tracker.jsx";
import Notes from "./Notes.jsx";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import Products from "./Products.jsx";
import AskHer from "./AskHer.jsx";
import Calender from "./Calender.jsx";

// Role-Based Guard Component
function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole"); 
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/landing" element={<LandingPage />} />

        {/* Shared Base Home Route */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={["user", "doctor"]}>
              <Homepage />
            </ProtectedRoute>
          }
        />

        {/* Doctor-Only Area */}
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorsDashboard />
            </ProtectedRoute>
          }
        />

        {/* Medical & Tracking Features (Accessible by both or specific roles) */}
        <Route
          path="/tracker"
          element={
            <ProtectedRoute allowedRoles={["user", "doctor"]}>
              <Tracker />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes"
          element={
            <ProtectedRoute allowedRoles={["user", "doctor"]}>
              <Notes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute allowedRoles={["user", "doctor"]}>
              <Products />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ask-her"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <AskHer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/calendar"
          element={
            <ProtectedRoute allowedRoles={["user", "doctor"]}>
              <Calender />
            </ProtectedRoute>
          }
        />

        {/* Fallback Error Page */}
        <Route path="/unauthorized" element={<ErrorPage message="Access Denied" />} />
        <Route path="*" element={<ErrorPage message="Page Not Found" />} />
      </Routes>
    </BrowserRouter>
  );
}
