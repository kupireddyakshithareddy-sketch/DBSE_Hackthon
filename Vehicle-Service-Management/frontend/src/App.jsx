
import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import BookService from "./pages/BookService.jsx";

import {
  MyVehicles,
  ServiceStatus,
  ServiceHistory,
  Invoices,
  MyProfile
} from "./pages/CustomerPages.jsx";

import AdminDashboard from "./pages/AdminDashboard.jsx";
import MechanicDashboard from "./pages/MechanicDashboard.jsx";

// Get logged-in user details
function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

// Protect pages based on login and role
function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = getUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const role = String(user.role || "").toLowerCase();

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "admin" || role === "manager") {
      return <Navigate to="/admin-dashboard" replace />;
    }

    if (role === "mechanic") {
      return <Navigate to="/mechanic-dashboard" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Redirect user based on role
function HomeRedirect() {
  const token = localStorage.getItem("token");
  const user = getUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const role = String(user.role || "").toLowerCase();

  if (role === "admin" || role === "manager") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  if (role === "mechanic") {
    return <Navigate to="/mechanic-dashboard" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Customer Booking */}
        <Route
          path="/book-service"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <BookService />
            </ProtectedRoute>
          }
        />

        {/* Customer Vehicles */}
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <MyVehicles />
            </ProtectedRoute>
          }
        />

        {/* Customer Service Status */}
        <Route
          path="/service-status"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <ServiceStatus />
            </ProtectedRoute>
          }
        />

        {/* Customer Service History */}
        <Route
          path="/history"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <ServiceHistory />
            </ProtectedRoute>
          }
        />

        {/* Customer Invoices */}
        <Route
          path="/invoices"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Invoices />
            </ProtectedRoute>
          }
        />

        {/* Customer Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <MyProfile />
            </ProtectedRoute>
          }
        />

        {/* Admin / Manager Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "manager"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Mechanic Dashboard */}
        <Route
          path="/mechanic-dashboard"
          element={
            <ProtectedRoute allowedRoles={["mechanic"]}>
              <MechanicDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default Redirect */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="*" element={<HomeRedirect />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
