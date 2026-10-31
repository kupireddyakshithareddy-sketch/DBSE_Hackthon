
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// Automatically add missing vehicle columns
const setup = db.query(`
  ALTER TABLE vehicles
  ADD COLUMN IF NOT EXISTS vehicle_type ENUM('Car','Bike') DEFAULT 'Car',
  ADD COLUMN IF NOT EXISTS fuel_type VARCHAR(30),
  ADD COLUMN IF NOT EXISTS image_url TEXT
`).catch(error => {
  if (error.code !== "ER_DUP_FIELDNAME") {
    console.error("Vehicle table setup:", error.message);
  }
});

async function verifyToken(req, res, next) {
  try {
    await setup;

    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Please login first." });
    }

    const decoded = jwt.verify(
      header.split(" ")[1],
      process.env.JWT_SECRET
    );

    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ message: "Invalid login token." });
  }
}

// Get logged-in customer's vehicles
router.get("/", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM vehicles WHERE user_id = ? ORDER BY id DESC",
      [req.userId]
    );
    res.json({ success: true, vehicles: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load vehicles." });
  }
});

// Add vehicle
router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      vehicle_type, brand, model, registration_number,
      vehicle_year, current_km, fuel_type, image_url
    } = req.body;

    if (!vehicle_type || !brand || !model || !registration_number) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const [result] = await db.query(
      `INSERT INTO vehicles
       (user_id, vehicle_type, brand, model, registration_number,
        vehicle_year, current_km, fuel_type, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.userId, vehicle_type, brand.trim(), model.trim(),
        registration_number.trim().toUpperCase(),
        vehicle_year || null, current_km || 0,
        fuel_type || null, image_url || null
      ]
    );

    res.status(201).json({
      success: true,
      message: "Vehicle added successfully!",
      vehicleId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(error.code === "ER_DUP_ENTRY" ? 409 : 500).json({
      message: error.code === "ER_DUP_ENTRY"
        ? "Registration number already exists."
        : "Unable to add vehicle."
    });
  }
});

// Update own vehicle
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const {
      vehicle_type, brand, model, registration_number,
      vehicle_year, current_km, fuel_type, image_url
    } = req.body;

    const [result] = await db.query(
      `UPDATE vehicles SET vehicle_type=?, brand=?, model=?,
       registration_number=?, vehicle_year=?, current_km=?,
       fuel_type=?, image_url=?
       WHERE id=? AND user_id=?`,
      [
        vehicle_type, brand, model, registration_number.toUpperCase(),
        vehicle_year || null, current_km || 0, fuel_type || null,
        image_url || null, req.params.id, req.userId
      ]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Vehicle not found." });
    }

    res.json({ success: true, message: "Vehicle updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to update vehicle." });
  }
});

// Delete own vehicle
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM vehicles WHERE id=? AND user_id=?",
      [req.params.id, req.userId]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Vehicle not found." });
    }

    res.json({ success: true, message: "Vehicle deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to delete vehicle. Check whether it has existing bookings."
    });
  }
});

module.exports = router;
