
const Booking = require("../models/Booking");

// Get bookings based on logged-in user's role
exports.list = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "admin") {
      // Manager can see all bookings
      filter = {};
    } else if (req.user.role === "mechanic") {
      // Mechanic can see assigned bookings
      filter = {
        mechanicId: req.user.id,
        status: { $nin: ["Pending", "Rejected"] }
      };
    } else {
      // Customer can see only their bookings
      filter = { customerId: req.user.id };
    }

    const bookings = await Booking.find(filter).sort({
      createdAt: -1
    });

    res.json(bookings);

  } catch (error) {
    console.error("Load bookings error:", error.message);
    res.status(500).json({
      message: "Could not load bookings."
    });
  }
};


// Customer creates a booking
exports.create = async (req, res) => {
  try {

    // Debug: print frontend request data
    console.log("BOOKING REQUEST BODY:", req.body);

    const {
      name,
      email,
      phone,
      vehicle,
      vehicleImage,
      vehicleCategory,
      registration,
      service,
      date,
      time,
      center,
      problem,
      estimatedCost
    } = req.body;

    // Handle vehicle value if it comes as an object
    const vehicleValue =
      typeof vehicle === "string"
        ? vehicle.trim()
        : vehicle?.name || vehicle?.model || vehicle?.vehicleName || "";

    const serviceValue =
      typeof service === "string" ? service.trim() : "";

    const dateValue =
      typeof date === "string" ? date.trim() : "";

    // Validate required fields
    if (!vehicleValue || !serviceValue || !dateValue) {
      console.log("Missing booking fields:", {
        vehicle: vehicleValue,
        service: serviceValue,
        date: dateValue
      });

      return res.status(400).json({
        message: "Vehicle, service and booking date are required."
      });
    }

    const booking = await Booking.create({
      customerId: req.user.id,

      name: name || "",
      email: email || "",
      phone: phone || "",

      vehicle: vehicleValue,
      vehicleImage: vehicleImage || "",
      vehicleCategory: vehicleCategory || "",
      registration: registration || "",

      service: serviceValue,
      date: dateValue,
      time: time || "",
      center: center || "",
      problem: problem || "",

      estimatedCost: Number(estimatedCost) || 0,

      status: "Pending"
    });

    console.log("Booking saved successfully:", booking._id);

    res.status(201).json({
      success: true,
      message: "Service booking submitted successfully!",
      booking
    });

  } catch (error) {
    console.error("Create booking error:", error);

    res.status(500).json({
      message: "Could not create booking.",
      error: error.message
    });
  }
};


// Manager approves or rejects a booking and assigns a mechanic
exports.updateByManager = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Manager access required."
      });
    }

    const {
      status,
      reason,
      assignedMechanic,
      mechanicId
    } = req.body;

    if (!["Approved", "Rejected", "Assigned"].includes(status)) {
      return res.status(400).json({
        message: "Invalid booking status."
      });
    }

    if (status === "Rejected" && !reason?.trim()) {
      return res.status(400).json({
        message: "Please provide a rejection reason."
      });
    }

    const update = {
      status,
      reason: status === "Rejected" ? reason.trim() : ""
    };

    if (assignedMechanic) {
      update.assignedMechanic = assignedMechanic;
      update.mechanicId = mechanicId || null;
      update.status = "Assigned";
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      {
        new: true,
        runValidators: true
      }
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found."
      });
    }

    res.json({
      success: true,
      message: "Booking updated successfully.",
      booking
    });

  } catch (error) {
    console.error("Manager update error:", error.message);

    res.status(500).json({
      message: "Could not update booking."
    });
  }
};


// Mechanic updates service progress
exports.updateByMechanic = async (req, res) => {
  try {
    if (req.user.role !== "mechanic") {
      return res.status(403).json({
        message: "Mechanic access required."
      });
    }

    const { status, workNote } = req.body;

    if (!["In Progress", "Completed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid service status."
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      mechanicId: req.user.id
    });

    if (!booking) {
      return res.status(404).json({
        message: "Assigned booking not found."
      });
    }

    booking.status = status;

    if (workNote !== undefined) {
      booking.workNote = workNote;
    }

    await booking.save();

    res.json({
      success: true,
      message: "Service status updated successfully.",
      booking
    });

  } catch (error) {
    console.error("Mechanic update error:", error.message);

    res.status(500).json({
      message: "Could not update service status."
    });
  }
};
