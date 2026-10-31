
import React, { useEffect, useState } from "react";

const API = "http://localhost:5000/api/vehicles";

const emptyForm = {
  vehicle_type: "Car",
  brand: "",
  model: "",
  registration_number: "",
  vehicle_year: "",
  current_km: "",
  fuel_type: "Petrol",
  image_url: ""
};

export default function VehicleManager() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const loadVehicles = async () => {
    try {
      const response = await fetch(API, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setVehicles(data.vehicles || []);
    } catch (error) {
      setMessage(error.message || "Unable to load vehicles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveVehicle = async (e) => {
    e.preventDefault();

    try {
      const url = editingId ? `${API}/${editingId}` : API;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setMessage(data.message);
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      await loadVehicles();
    } catch (error) {
      setMessage(error.message || "Unable to save vehicle.");
    }
  };

  const editVehicle = (vehicle) => {
    setForm({
      vehicle_type: vehicle.vehicle_type || "Car",
      brand: vehicle.brand || "",
      model: vehicle.model || "",
      registration_number: vehicle.registration_number || "",
      vehicle_year: vehicle.vehicle_year || "",
      current_km: vehicle.current_km || "",
      fuel_type: vehicle.fuel_type || "Petrol",
      image_url: vehicle.image_url || ""
    });

    setEditingId(vehicle.id);
    setShowForm(true);
    setMessage("");
  };

  const deleteVehicle = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setMessage(data.message);
      await loadVehicles();
    } catch (error) {
      setMessage(error.message || "Unable to delete vehicle.");
    }
  };

  const cancelForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <section style={{ padding: "20px 0" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
        marginBottom: "22px"
      }}>
        <div>
          <h2>🚘 My Vehicles</h2>
          <p>Manage your personal cars and bikes.</p>
        </div>

        <button
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(true);
            setMessage("");
          }}
          style={buttonStyle}
        >
          + Add Vehicle
        </button>
      </div>

      {message && (
        <p style={{
          padding: "12px",
          background: "#e8f5e9",
          color: "#176b35",
          borderRadius: "8px"
        }}>
          {message}
        </p>
      )}

      {showForm && (
        <form onSubmit={saveVehicle} style={formStyle}>
          <h3>{editingId ? "Edit Vehicle" : "Add New Vehicle"}</h3>

          <label>Vehicle Type</label>
          <select name="vehicle_type" value={form.vehicle_type}
            onChange={handleChange} required style={inputStyle}>
            <option value="Car">Car</option>
            <option value="Bike">Bike</option>
          </select>

          <label>Brand</label>
          <input name="brand" placeholder="Example: Honda"
            value={form.brand} onChange={handleChange}
            required style={inputStyle} />

          <label>Model</label>
          <input name="model" placeholder="Example: City"
            value={form.model} onChange={handleChange}
            required style={inputStyle} />

          <label>Registration Number</label>
          <input name="registration_number"
            placeholder="Example: TS09AB1234"
            value={form.registration_number}
            onChange={handleChange}
            required style={inputStyle} />

          <label>Manufacturing Year</label>
          <input name="vehicle_year" type="number"
            min="1900" max={new Date().getFullYear() + 1}
            placeholder="2024" value={form.vehicle_year}
            onChange={handleChange} style={inputStyle} />

          <label>Current Kilometres</label>
          <input name="current_km" type="number"
            min="0" placeholder="Enter kilometres"
            value={form.current_km}
            onChange={handleChange} style={inputStyle} />

          <label>Fuel Type</label>
          <select name="fuel_type" value={form.fuel_type}
            onChange={handleChange} style={inputStyle}>
            <option>Petrol</option>
            <option>Diesel</option>
            <option>Electric</option>
            <option>Hybrid</option>
            <option>CNG</option>
          </select>

          <label>Vehicle Image URL (Optional)</label>
          <input name="image_url" type="url"
            placeholder="Paste image URL"
            value={form.image_url}
            onChange={handleChange} style={inputStyle} />

          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
            <button type="submit" style={buttonStyle}>
              {editingId ? "Update Vehicle" : "Save Vehicle"}
            </button>
            <button type="button" onClick={cancelForm}
              style={{ ...buttonStyle, background: "#64748b" }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Loading vehicles...</p>
      ) : vehicles.length === 0 ? (
        <div style={emptyStyle}>
          <h3>No Vehicles Added Yet</h3>
          <p>Add your own car or bike to get started.</p>
          <button style={buttonStyle} onClick={() => setShowForm(true)}>
            + Add Your First Vehicle
          </button>
        </div>
      ) : (
        <div style={gridStyle}>
          {vehicles.map(vehicle => (
            <div key={vehicle.id} style={cardStyle}>
              <img
                src={vehicle.image_url || "https://placehold.co/600x400/14243b/ffffff?text=My+Vehicle"}
                alt={vehicle.brand + " " + vehicle.model}
                style={{
                  width: "100%",
                  height: "170px",
                  objectFit: "cover",
                  borderRadius: "10px"
                }}
              />

              <h3>{vehicle.brand} {vehicle.model}</h3>
              <p>{vehicle.vehicle_type} • {vehicle.vehicle_year || "Year not added"}</p>
              <p>Registration: {vehicle.registration_number}</p>
              <p>Fuel: {vehicle.fuel_type || "Not specified"}</p>
              <p>Distance: {vehicle.current_km || 0} KM</p>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button style={buttonStyle}
                  onClick={() => editVehicle(vehicle)}>
                  ✏️ Edit
                </button>
                <button
                  style={{ ...buttonStyle, background: "#dc3545" }}
                  onClick={() => deleteVehicle(vehicle.id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

const buttonStyle = {
  background: "#f59e0b",
  color: "#111827",
  border: "none",
  padding: "11px 18px",
  borderRadius: "7px",
  cursor: "pointer",
  fontWeight: "bold"
};

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "11px",
  margin: "7px 0 15px",
  border: "1px solid #cbd5e1",
  borderRadius: "7px",
  boxSizing: "border-box"
};

const formStyle = {
  background: "#ffffff",
  color: "#172033",
  padding: "22px",
  borderRadius: "12px",
  marginBottom: "25px",
  maxWidth: "600px",
  boxShadow: "0 3px 15px rgba(0,0,0,0.08)"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px"
};

const cardStyle = {
  background: "#ffffff",
  color: "#172033",
  padding: "15px",
  borderRadius: "12px",
  boxShadow: "0 3px 15px rgba(0,0,0,0.08)"
};

const emptyStyle = {
  textAlign: "center",
  padding: "40px 20px",
  background: "#ffffff",
  color: "#172033",
  borderRadius: "12px"
};
