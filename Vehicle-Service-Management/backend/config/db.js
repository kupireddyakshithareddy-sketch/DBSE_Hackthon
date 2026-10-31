
const mysql = require("mysql2");
const mongoose = require("mongoose");
require("dotenv").config();

// Existing MySQL connection - unchanged
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "vehicle_service_db",
  waitForConnections: true,
  connectionLimit: 10
});

// MongoDB connection
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.log("MongoDB Connection Error:", error.message);
    throw error;
  }
};

// Export both connections
module.exports = {
  mysqlDB: pool.promise(),
  connectMongoDB
};
