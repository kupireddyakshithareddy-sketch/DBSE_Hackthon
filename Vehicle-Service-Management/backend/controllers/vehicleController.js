
const Vehicle = require("../models/Vehicle");

// Get vehicles of logged-in customer
exports.list = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(vehicles);

  } catch (error) {
    console.error("Load vehicles error:", error.message);

    res.status(500).json({
      message: "Could not load vehicles."
    });
  }
};


// Add a new vehicle
exports.create = async (req, res) => {
  try {
    const {
      registration_number,
      brand,
      model,
      vehicle_year,
      current_km
    } = req.body;

    // Validate required fields
    if (!registration_number || !brand || !model) {
      return res.status(400).json({
        message: "Registration number, brand and model are required."
      });
    }

    // Create vehicle in MongoDB
    const vehicle = await Vehicle.create({
      userId: req.user.id,
      registration_number: registration_number.trim().toUpperCase(),
      brand: brand.trim(),
      model: model.trim(),
      vehicle_year: vehicle_year ? Number(vehicle_year) : null,
      current_km: Number(current_km) || 0
    });

    res.status(201).json({
      success: true,
      message: "Vehicle added successfully.",
      vehicle
    });

  } catch (error) {

    // Duplicate registration number
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This registration number is already added."
      });
    }

    console.error("Add vehicle error:", error.message);

    res.status(500).json({
      message: "Could not add vehicle."
    });
  }
};
