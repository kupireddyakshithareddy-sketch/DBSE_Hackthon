
import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./CustomerPages.css";

function getBookings() {
  try {
    const data = JSON.parse(localStorage.getItem("bookings") || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function Sidebar() {
  const links = [
    ["/dashboard", "▦", "Dashboard"],
    ["/vehicles", "🚘", "My Vehicles"],
    ["/book-service", "🔧", "Book Service"],
    ["/service-status", "📋", "Service Status"],
    ["/history", "📜", "Service History"],
    ["/invoices", "🧾", "Invoices"],
    ["/profile", "👤", "My Profile"]
  ];

  return (
    <aside className="customer-sidebar">
      <h2>🚘 AutoCare</h2>
      <p>Vehicle Service Management</p>

      <nav>
        {links.map(([path, icon, label]) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => isActive ? "active" : ""}
          >
            <span>{icon}</span> {label}
          </NavLink>
        ))}
      </nav>

      <button
        className="customer-logout"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </aside>
  );
}

function Layout({ title, subtitle, children }) {
  return (
    <div className="customer-layout">
      <Sidebar />

      <main className="customer-main">
        <header className="customer-header">
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>

          <Link to="/dashboard" className="back-dashboard">
            ← Dashboard
          </Link>
        </header>

        {children}
      </main>
    </div>
  );
}

// MY VEHICLES - FETCH FROM MONGODB
export function MyVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your vehicles.");
        setVehicles([]);
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/vehicles",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load vehicles.");
      }

      // Backend may return an array or an object containing vehicles
      const vehicleList = Array.isArray(data)
        ? data
        : Array.isArray(data.vehicles)
          ? data.vehicles
          : [];

      setVehicles(vehicleList);

    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleBookService = (vehicle) => {
    const selectedVehicle = {
      ...vehicle,
      name: `${vehicle.brand || ""} ${vehicle.model || ""}`.trim(),
      type: vehicle.type || vehicle.category || "Vehicle",
      year: vehicle.vehicle_year || vehicle.year || "",
      registration:
        vehicle.registration_number ||
        vehicle.registration ||
        "",
      registrationNumber:
        vehicle.registration_number ||
        vehicle.registration ||
        "",
      image:
        vehicle.image ||
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=700"
    };

    localStorage.setItem(
      "selectedVehicle",
      JSON.stringify(selectedVehicle)
    );

    window.location.href = "/book-service";
  };

  return (
    <Layout
      title="My Vehicles"
      subtitle="Manage and view your vehicle collection"
    >
      <div className="customer-count">
        🚘 Your Vehicle Collection
        <strong>{vehicles.length} Vehicles</strong>
      </div>

      {loading ? (
        <div className="customer-empty">
          <h3>Loading your vehicles...</h3>
        </div>
      ) : error ? (
        <div className="customer-empty">
          <h3>Unable to load vehicles</h3>
          <p>{error}</p>
          <button onClick={fetchVehicles}>Try Again</button>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="customer-empty">
          <h3>No vehicles added yet</h3>
          <p>Your added vehicles will appear here.</p>
          <Link to="/add-vehicle">+ Add Your First Vehicle</Link>
        </div>
      ) : (
        <div className="customer-vehicle-grid">
          {vehicles.map((vehicle) => {
            const vehicleName =
              `${vehicle.brand || ""} ${vehicle.model || ""}`.trim();

            const image =
              vehicle.image ||
              "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=700";

            return (
              <div
                className="customer-vehicle-card"
                key={vehicle._id || vehicle.registration_number}
              >
                <img
                  src={image}
                  alt={vehicleName || "My Vehicle"}
                />

                <div>
                  <h3>{vehicleName || "My Vehicle"}</h3>

                  <p>
                    {vehicle.vehicle_year || "Year not available"}
                  </p>

                  <p>
                    Registration:{" "}
                    {vehicle.registration_number || "Not available"}
                  </p>

                  <p>
                    Current KM: {vehicle.current_km ?? 0}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleBookService(vehicle)}
                  >
                    Book Service →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}

// SERVICE STATUS
export function ServiceStatus() {
  const bookings = getBookings();

  return (
    <Layout
      title="Service Status"
      subtitle="Track your vehicle service bookings"
    >
      <div className="customer-panel">
        <h2>📋 Your Current Service Bookings</h2>

        {bookings.length === 0 ? (
          <div className="customer-empty">
            <h3>No service bookings found</h3>
            <p>Your confirmed service bookings will appear here.</p>
            <Link to="/book-service">+ Book a Service</Link>
          </div>
        ) : (
          <div className="customer-table-wrap">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Cost</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking, index) => (
                  <tr key={booking.id || index}>
                    <td>
                      {booking.vehicle || booking.vehicle_name || "Vehicle"}
                    </td>
                    <td>
                      {booking.service || booking.service_name || "Service"}
                    </td>
                    <td>{booking.date || "—"}</td>
                    <td>{booking.cost ? `₹${booking.cost}` : "—"}</td>
                    <td>
                      <span className="status-badge">
                        {booking.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

// SERVICE HISTORY
export function ServiceHistory() {
  const bookings = getBookings().filter(
    (booking) =>
      ["completed", "delivered"].includes(
        String(booking.status || "").toLowerCase()
      )
  );

  return (
    <Layout
      title="Service History"
      subtitle="View your previous vehicle services"
    >
      <div className="customer-panel">
        <h2>📜 Previous Services</h2>

        {bookings.length === 0 ? (
          <div className="customer-empty">
            <h3>No completed services yet</h3>
            <p>After your services are completed, they will appear here.</p>
            <Link to="/book-service">Book Your First Service</Link>
          </div>
        ) : (
          <div className="customer-table-wrap">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Service</th>
                  <th>Service Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking, index) => (
                  <tr key={booking.id || index}>
                    <td>
                      {booking.vehicle || booking.vehicle_name || "Vehicle"}
                    </td>
                    <td>
                      {booking.service || booking.service_name || "Service"}
                    </td>
                    <td>{booking.date || "—"}</td>
                    <td>{booking.cost ? `₹${booking.cost}` : "—"}</td>
                    <td>
                      <span className="status-badge">Completed</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

// INVOICES
export function Invoices() {
  const bookings = getBookings().filter(
    (booking) =>
      ["completed", "delivered"].includes(
        String(booking.status || "").toLowerCase()
      )
  );

  return (
    <Layout
      title="Invoices"
      subtitle="View your vehicle service bills"
    >
      <div className="customer-panel">
        <h2>🧾 Your Invoices</h2>

        {bookings.length === 0 ? (
          <div className="customer-empty">
            <h3>No invoices available</h3>
            <p>Invoices will appear here after your service is completed.</p>
          </div>
        ) : (
          bookings.map((booking, index) => (
            <div className="invoice-card" key={booking.id || index}>
              <div>
                <h3>
                  AutoCare Service Invoice #{booking.id || index + 1}
                </h3>
                <p>{booking.vehicle || booking.vehicle_name || "Vehicle"}</p>
                <p>{booking.service || booking.service_name || "Service"}</p>
                <p>Date: {booking.date || "—"}</p>
                <strong>₹{booking.cost || 0}</strong>
              </div>

              <span className="status-badge">Completed</span>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}

// MY PROFILE
export function MyProfile() {
  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  const name =
    user.name || user.fullName || user.full_name || "Customer";

  const email = user.email || "";

  return (
    <Layout
      title="My Profile"
      subtitle="Manage your personal account information"
    >
      <div className="customer-panel profile-panel">
        <div className="profile-avatar">👤</div>
        <h2>{name}</h2>
        <p>{email || "Email not available"}</p>

        <div className="profile-details">
          <div>
            <span>Full Name</span>
            <strong>{name}</strong>
          </div>

          <div>
            <span>Email Address</span>
            <strong>{email || "Not available"}</strong>
          </div>

          <div>
            <span>Account Type</span>
            <strong>Owner</strong>
          </div>
        </div>

        <Link to="/dashboard" className="profile-button">
          Back to Dashboard
        </Link>
      </div>
    </Layout>
  );
}
