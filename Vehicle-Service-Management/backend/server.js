
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Vehicle Service Management API is running.");
});

// Backend health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running."
  });
});

// MongoDB test
app.get("/api/mongodb-test", (req, res) => {
  const mongoose = require("mongoose");

  if (mongoose.connection.readyState === 1) {
    res.json({
      success: true,
      message: "MongoDB Connected Successfully!",
      database: mongoose.connection.name
    });
  } else {
    res.status(500).json({
      success: false,
      message: "MongoDB is not connected."
    });
  }
});

// Existing MySQL test
app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await db.mysqlDB.query(
      "SELECT COUNT(*) AS serviceCount FROM services"
    );

    res.json({
      success: true,
      message: "MySQL Connected Successfully!",
      serviceCount: rows[0].serviceCount
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "MySQL connection failed."
    });
  }
});

// Existing services route
app.get("/api/services", async (req, res) => {
  try {
    const [rows] = await db.mysqlDB.query(
      "SELECT id, service_name, description, base_price, estimated_minutes FROM services ORDER BY id"
    );

    res.json(rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Could not load services."
    });
  }
});

// Existing routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);

// Start server after MongoDB connects
const startServer = async () => {
  try {
    await db.connectMongoDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Backend startup failed:", error.message);
  }
};

startServer();
