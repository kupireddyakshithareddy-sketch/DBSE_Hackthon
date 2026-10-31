
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import VehicleManager from "../components/VehicleManager";
import "./Dashboard.css";

const menu = [
  { path: "/dashboard", icon: "▦", name: "Dashboard" },
  { path: "/vehicles", icon: "🚘", name: "My Vehicles" },
  { path: "/book-service", icon: "🔧", name: "Book Service" },
  { path: "/service-status", icon: "📋", name: "Service Status" },
  { path: "/history", icon: "📜", name: "Service History" },
  { path: "/invoices", icon: "🧾", name: "Invoices" },
  { path: "/profile", icon: "👤", name: "My Profile" }
];

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [profile] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("user") ||
        localStorage.getItem("customerProfile") ||
        "{}"
      );
    } catch {
      return {};
    }
  });

  const [bookings] = useState(() => {
    try {
      const data = JSON.parse(localStorage.getItem("bookings") || "[]");
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  });

  const currentPage = location.pathname;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const pageTitle =
    menu.find(item => item.path === currentPage)?.name || "Dashboard";

  return (
    <div className="auto-dashboard">

      {/* SIDEBAR */}
      <aside className="auto-sidebar">
        <h2>🚘 AutoCare</h2>
        <p>Vehicle Service Management</p>

        <nav>
          {menu.map(item => (
            <button
              key={item.path}
              className={currentPage === item.path ? "active" : ""}
              onClick={() => navigate(item.path)}
            >
              <span>{item.icon}</span> {item.name}
            </button>
          ))}
        </nav>

        <button className="logout" onClick={logout}>
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="auto-main">

        <header className="auto-header">
          <div>
            <h1>{pageTitle}</h1>
            <p>Welcome back! Manage your vehicles with AutoCare.</p>
          </div>

          <span>👤 {profile.name || "Customer"}</span>
        </header>

        {/* DASHBOARD */}
        <section className="vehicle-section">

          <div className="section-heading">
            <div>
              <h2>🚗 Your Vehicle Collection</h2>
              <p>Add and manage your personal cars and bikes.</p>
            </div>

            <button
              className="book-service-btn"
              onClick={() => navigate("/vehicles")}
            >
              + Add Vehicle
            </button>
          </div>

          {/* Customer's own vehicles from MySQL */}
          <VehicleManager />

        </section>

        {/* SERVICE OVERVIEW AND VEHICLE HEALTH */}
        <section className="bottom-section">

          <div className="info-card">
            <h2>🔧 Service Overview</h2>
            <p>Total Bookings: {bookings.length}</p>

            <p>
              Pending Services: {
                bookings.filter(
                  booking =>
                    String(booking.status).toLowerCase() === "pending"
                ).length
              }
            </p>

            <p>Upcoming: Check your service status</p>

            <button
              className="book-service-btn"
              onClick={() => navigate("/service-status")}
            >
              View Service Status →
            </button>
          </div>

          <div className="info-card">
            <h2>💚 Vehicle Health</h2>
            <p>Engine Health: Check during service</p>
            <p>Brake Condition: Check during service</p>
            <p>Battery Life: Check during service</p>
            <p>Tyre Condition: Check during service</p>
          </div>

        </section>

      </main>
    </div>
  );
}

export default Dashboard;
