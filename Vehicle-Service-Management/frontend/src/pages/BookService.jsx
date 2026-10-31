
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BookService.css";

function BookService() {
  const navigate = useNavigate();

  const [vehicle] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("selectedVehicle")) || null;
    } catch {
      return null;
    }
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    center: "",
    problem: ""
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 2026 INDIA SERVICE PRICING
  const prices = {
    "General Service": {
      Hatchback: 1999,
      Sedan: 2999,
      SUV: 3999,
      Luxury: 8999
    },
    "Oil Change": {
      Hatchback: 1499,
      Sedan: 2499,
      SUV: 3499,
      Luxury: 14999
    },
    "Engine Repair": {
      Hatchback: 4999,
      Sedan: 7999,
      SUV: 12999,
      Luxury: 24999
    },
    "Brake Repair": {
      Hatchback: 1999,
      Sedan: 2999,
      SUV: 4999,
      Luxury: 9999
    },
    "AC Service": {
      Hatchback: 1499,
      Sedan: 2499,
      SUV: 3499,
      Luxury: 6999
    },
    "Tyre Replacement": {
      Hatchback: 3000,
      Sedan: 4000,
      SUV: 6000,
      Luxury: 25000
    },
    "Battery Service": {
      Hatchback: 3500,
      Sedan: 5000,
      SUV: 7000,
      Luxury: 25000
    },
    "Full Vehicle Inspection": {
      Hatchback: 1499,
      Sedan: 1999,
      SUV: 2499,
      Luxury: 4999
    }
  };

  // AUTOMATIC VEHICLE CATEGORY
  const getCategory = () => {
    if (!vehicle) return "Hatchback";

    const type = (
      vehicle.type + " " + vehicle.name
    ).toLowerCase();

    if (
      type.includes("luxury") ||
      type.includes("supercar") ||
      type.includes("sports") ||
      type.includes("lamborghini") ||
      type.includes("audi r8") ||
      type.includes("porsche") ||
      type.includes("bmw") ||
      type.includes("mercedes") ||
      type.includes("range rover")
    ) {
      return "Luxury";
    }

    if (type.includes("suv")) return "SUV";

    if (
      type.includes("sedan") ||
      type.includes("tesla model 3") ||
      type.includes("honda city")
    ) {
      return "Sedan";
    }

    return "Hatchback";
  };

  const category = getCategory();

  // AUTOMATIC SERVICE COST
  const cost = form.service
    ? prices[form.service][category]
    : 0;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // SAVE BOOKING IN MONGODB THROUGH BACKEND API
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vehicle) {
      alert("Please select a vehicle first.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const bookingData = {
        name: form.name,
        email: form.email,
        phone: form.phone,

        vehicle: vehicle.name,
        vehicleImage: vehicle.image || "",
        vehicleCategory: category,
        registration:
          vehicle.registration ||
          vehicle.registrationNumber ||
          "",

        service: form.service,
        date: form.date,
        time: form.time,
        center: form.center,
        problem: form.problem,

        estimatedCost: cost
      };

      const response = await fetch(
        "http://localhost:5000/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(bookingData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Booking failed."
        );
      }

      // Booking successfully saved in MongoDB
      setSuccess(true);

    } catch (error) {
      console.error("Booking error:", error);
      setError(
        error.message || "Unable to submit booking."
      );
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS SCREEN
  if (success) {
    return (
      <div className="booking-success">
        <div className="success-card">
          <div className="success-icon">✓</div>

          <h1>Booking Successful!</h1>

          <p>
            Your service appointment has been submitted.
          </p>

          <h3>{vehicle.name}</h3>

          <p>Vehicle Category: {category}</p>

          <h2>
            ₹{cost.toLocaleString("en-IN")}
          </h2>

          <span className="pending-status">
            Status: Pending
          </span>

          <button
            onClick={() => navigate("/service-status")}
          >
            View Booking Status
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">

      <aside className="booking-sidebar">
        <h2>🚘 AutoCare</h2>
        <p>Vehicle Service Management</p>

        <nav>
          <a href="/">▦ Dashboard</a>
          <a href="/">🚘 My Vehicles</a>

          <a className="active" href="/book-service">
            🔧 Book Service
          </a>

          <a href="/service-status">
            📋 Service Status
          </a>

          <a href="/history">
            📜 Service History
          </a>

          <a href="/invoices">
            🧾 Invoices
          </a>

          <a href="/profile">
            👤 My Profile
          </a>
        </nav>

        <button
          className="booking-logout"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </aside>

      <main className="booking-main">

        <header className="booking-header">
          <div>
            <h1>Book a Service</h1>
            <p>
              Schedule your vehicle maintenance appointment
            </p>
          </div>

          <button
            className="back-btn"
            onClick={() => navigate("/")}
          >
            ← Back to Dashboard
          </button>
        </header>

        {vehicle && (
          <section className="selected-car">
            <h2>🚗 Selected Vehicle</h2>

            <div className="selected-car-content">
              <img
                src={vehicle.image}
                alt={vehicle.name}
              />

              <div>
                <h2>{vehicle.name}</h2>
                <p>
                  {vehicle.type} | Model {vehicle.year}
                </p>
                <p>Fuel: {vehicle.fuel}</p>
                <p>Transmission: {vehicle.transmission}</p>
                <p>Category: {category}</p>
              </div>

              <span>✓ Selected</span>
            </div>
          </section>
        )}

        {!vehicle && (
          <div className="no-car">
            Please select a vehicle from Dashboard first.

            <button onClick={() => navigate("/")}>
              Go to Dashboard
            </button>
          </div>
        )}

        <form
          className="booking-form"
          onSubmit={handleSubmit}
        >

          <h2>👤 Customer Information</h2>

          <div className="form-grid">

            <div className="form-group">
              <label>Full Name *</label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="10 digit phone number"
                pattern="[0-9]{10}"
                maxLength="10"
                required
              />
            </div>

          </div>

          <div className="form-divider" />

          <h2>🔧 Service Information</h2>

          <div className="form-grid">

            <div className="form-group">
              <label>Select Service *</label>

              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                required
              >
                <option value="">
                  Choose a service
                </option>

                {Object.keys(prices).map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Appointment Date *</label>

              <input
                type="date"
                name="date"
                value={form.date}
                min={(() => {
                  const d = new Date();
                  const offset = d.getTimezoneOffset();

                  return new Date(
                    d.getTime() - offset * 60000
                  )
                    .toISOString()
                    .split("T")[0];
                })()}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Appointment Time *</label>

              <select
                name="time"
                value={form.time}
                onChange={handleChange}
                required
              >
                <option value="">Select time</option>
                <option>09:00 AM</option>
                <option>10:00 AM</option>
                <option>11:00 AM</option>
                <option>12:00 PM</option>
                <option>02:00 PM</option>
                <option>03:00 PM</option>
                <option>04:00 PM</option>
                <option>05:00 PM</option>
              </select>
            </div>

            <div className="form-group">
              <label>Service Center *</label>

              <select
                name="center"
                value={form.center}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select service center
                </option>

                <option>AutoCare - Guntur</option>
                <option>AutoCare - Vijayawada</option>
                <option>AutoCare - Hyderabad</option>
                <option>AutoCare - Bangalore</option>
              </select>
            </div>

          </div>

          <div className="form-group problem-group">
            <label>Describe Vehicle Problem</label>

            <textarea
              name="problem"
              value={form.problem}
              onChange={handleChange}
              placeholder="Describe your vehicle problem..."
              rows="4"
            />
          </div>

          <div className="estimated-cost">

            <div>
              <span>Estimated Service Cost</span>

              <h2>
                ₹{cost.toLocaleString("en-IN")}
              </h2>

              <small>
                Vehicle Category: {category}
              </small>

              <br />

              <small>
                Price based on 2026 India service pricing.
                Final amount may vary after inspection.
              </small>
            </div>

            <span>🔧 AutoCare Service</span>

          </div>

          {error && (
            <p style={{
              color: "red",
              marginBottom: "10px"
            }}>
              {error}
            </p>
          )}

          <button
            className="confirm-booking"
            type="submit"
            disabled={!vehicle || loading}
          >
            {loading ? "Submitting..." : "✓ Confirm Booking"}
          </button>

        </form>
      </main>
    </div>
  );
}

export default BookService;
