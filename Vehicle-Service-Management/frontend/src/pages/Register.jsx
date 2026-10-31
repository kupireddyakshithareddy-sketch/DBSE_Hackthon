
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
    accessCode: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Registration successful! Please login.");
      navigate("/login");

    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h1 style={styles.logo}>AutoCare</h1>
        <p style={styles.subtitle}>
          Vehicle Service Management
        </p>

        <h2>Create Account</h2>
        <p style={styles.description}>
          Register for your AutoCare account
        </p>

        <form onSubmit={handleRegister}>

          <label style={styles.label}>Select Your Role</label>
          <select
            style={styles.input}
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="customer">Customer</option>
            <option value="admin">Manager / Admin</option>
            <option value="mechanic">Mechanic</option>
          </select>

          {form.role !== "customer" && (
            <>
              <label style={styles.label}>Authorized Access Code</label>
              <input
                style={styles.input}
                type="password"
                name="accessCode"
                placeholder="Enter authorized access code"
                value={form.accessCode}
                onChange={handleChange}
                required
              />
              <p style={styles.note}>
                Contact your administrator to obtain this code.
              </p>
            </>
          )}

          <label style={styles.label}>Full Name</label>
          <input
            style={styles.input}
            name="name"
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Email Address</label>
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Phone Number</label>
          <input
            style={styles.input}
            type="tel"
            name="phone"
            placeholder="Enter phone number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Create password (minimum 6 characters)"
            value={form.password}
            onChange={handleChange}
            minLength={6}
            required
          />

          {error && <p style={styles.error}>{error}</p>}

          <button
            style={styles.button}
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Create Account"}
          </button>

        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #101827, #263b55)",
    padding: "25px 15px",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box"
  },
  card: {
    background: "white",
    padding: "35px",
    borderRadius: "15px",
    width: "100%",
    maxWidth: "440px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    boxSizing: "border-box"
  },
  logo: {
    color: "#f97316",
    textAlign: "center",
    marginBottom: "5px"
  },
  subtitle: {
    textAlign: "center",
    color: "#777",
    marginBottom: "25px"
  },
  description: {
    color: "#777",
    marginBottom: "22px"
  },
  label: {
    display: "block",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "7px"
  },
  input: {
    width: "100%",
    padding: "12px",
    marginTop: "5px",
    marginBottom: "17px",
    border: "1px solid #ddd",
    borderRadius: "7px",
    boxSizing: "border-box",
    background: "#e8f0fe",
    fontSize: "15px"
  },
  note: {
    color: "#777",
    fontSize: "12px",
    marginTop: "-10px",
    marginBottom: "15px"
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "#f97316",
    color: "white",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "16px"
  },
  error: {
    color: "red",
    fontSize: "14px"
  },
  footer: {
    textAlign: "center",
    marginTop: "25px",
    color: "#555"
  },
  link: {
    color: "#f97316",
    fontWeight: "bold"
  }
};

export default Register;
