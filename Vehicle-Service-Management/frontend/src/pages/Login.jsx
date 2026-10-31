
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password, role })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      const userRole = data.user.role.toLowerCase();

      if (userRole === "admin") {
        navigate("/admin-dashboard");
      } else if (userRole === "mechanic") {
        navigate("/mechanic-dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      setError(err.message || "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h1 style={styles.logo}>AutoCare</h1>
        <p style={styles.subtitle}>Vehicle Service Management</p>

        <h2 style={styles.heading}>Welcome Back!</h2>
        <p style={styles.text}>Login to your account</p>

        <form onSubmit={handleLogin}>

          <label style={styles.label}>Select Your Role</label>

          <select
            style={styles.input}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="customer">Customer</option>
            <option value="admin">Manager / Admin</option>
            <option value="mechanic">Mechanic</option>
          </select>

          <label style={styles.label}>Email Address</label>

          <input
            style={styles.input}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label style={styles.label}>Password</label>

          <input
            style={styles.input}
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p style={styles.error}>{error}</p>}

          <button
            style={styles.button}
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div style={styles.footer}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.registerLink}>
            Register
          </Link>
        </div>

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
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    boxSizing: "border-box"
  },

  card: {
    background: "white",
    padding: "40px",
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
    marginBottom: "40px"
  },

  heading: {
    color: "#263b55"
  },

  text: {
    color: "#777",
    marginBottom: "25px"
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "bold",
    color: "#333"
  },

  input: {
    width: "100%",
    padding: "13px",
    marginBottom: "20px",
    border: "1px solid #ddd",
    borderRadius: "7px",
    boxSizing: "border-box",
    background: "#e8f0fe",
    fontSize: "15px"
  },

  button: {
    width: "100%",
    padding: "14px",
    background: "#f97316",
    color: "white",
    border: "none",
    borderRadius: "7px",
    fontSize: "16px",
    cursor: "pointer"
  },

  error: {
    color: "red",
    fontSize: "14px"
  },

  footer: {
    textAlign: "center",
    marginTop: "28px",
    color: "#555"
  },

  registerLink: {
    color: "#f97316",
    fontWeight: "bold",
    textDecoration: "underline"
  }
};

export default Login;
