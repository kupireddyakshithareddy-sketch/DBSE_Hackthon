
import React, { useEffect, useState } from "react";
import "./MechanicBooking.css";

function MechanicBooking() {
  const [bookings, setBookings] = useState([]);
  const [mechanicName, setMechanicName] = useState(
    localStorage.getItem("mechanicName") || ""
  );

  const loadBookings = () => {
    const data = JSON.parse(localStorage.getItem("bookings") || "[]");

    const assigned = data.filter(
      (booking) =>
        booking.assignedMechanic &&
        booking.assignedMechanic.toLowerCase() ===
          mechanicName.trim().toLowerCase()
    );

    setBookings(assigned);
  };

  useEffect(() => {
    loadBookings();
  }, [mechanicName]);

  const updateStatus = (id, status) => {
    const allBookings = JSON.parse(
      localStorage.getItem("bookings") || "[]"
    );

    const updated = allBookings.map((booking) =>
      booking.id === id
        ? { ...booking, status }
        : booking
    );

    localStorage.setItem("bookings", JSON.stringify(updated));
    loadBookings();
  };

  const handleName = (e) => {
    setMechanicName(e.target.value);
    localStorage.setItem("mechanicName", e.target.value);
  };

  return (
    <div className="mechanic-booking-page">
      <header className="mechanic-header">
        <h1>🔧 Mechanic Bookings</h1>
        <p>View your assigned customer service bookings</p>
      </header>

      <div className="mechanic-name-box">
        <label>Enter Your Mechanic Name</label>
        <input
          type="text"
          value={mechanicName}
          onChange={handleName}
          placeholder="Enter the name assigned by manager"
        />
      </div>

      <h2>My Assigned Bookings ({bookings.length})</h2>

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <h3>No Assigned Bookings</h3>
          <p>
            No bookings found for this mechanic.
            Check your name or wait for manager assignment.
          </p>
        </div>
      ) : (
        <div className="mechanic-booking-grid">
          {bookings.map((booking) => (
            <div className="mechanic-booking-card" key={booking.id}>
              <h3>{booking.vehicle}</h3>

              {booking.vehicleImage && (
                <img
                  src={booking.vehicleImage}
                  alt={booking.vehicle}
                />
              )}

              <p><b>Customer:</b> {booking.name}</p>
              <p><b>Email:</b> {booking.email}</p>
              <p><b>Phone:</b> {booking.phone}</p>
              <p><b>Vehicle:</b> {booking.vehicle}</p>
              <p><b>Service:</b> {booking.service}</p>
              <p><b>Date:</b> {booking.date}</p>
              <p><b>Time:</b> {booking.time}</p>
              <p><b>Service Center:</b> {booking.center}</p>
              <p><b>Problem:</b> {booking.problem || "Not specified"}</p>
              <p>
                <b>Estimated Cost:</b> ₹
                {Number(booking.estimatedCost || 0).toLocaleString("en-IN")}
              </p>

              <p>
                <b>Status:</b>{" "}
                <span className="mechanic-status">
                  {booking.status}
                </span>
              </p>

              {booking.status === "Approved" && (
                <button
                  onClick={() =>
                    updateStatus(booking.id, "In Progress")
                  }
                >
                  Start Service
                </button>
              )}

              {booking.status === "In Progress" && (
                <button
                  onClick={() =>
                    updateStatus(booking.id, "Completed")
                  }
                >
                  Complete Service
                </button>
              )}

              {booking.status === "Completed" && (
                <p className="completed-message">
                  ✓ Service Completed
                </p>
              )}

              {booking.status === "Rejected" && (
                <p className="rejected-message">
                  Rejected: {booking.reason}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MechanicBooking;
