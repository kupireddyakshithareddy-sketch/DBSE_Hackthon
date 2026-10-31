
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },

    vehicle: { type: String, required: true },
    vehicleImage: { type: String, default: "" },
    vehicleCategory: { type: String, default: "" },
    registration: { type: String, default: "" },

    service: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, default: "" },
    center: { type: String, default: "" },
    problem: { type: String, default: "" },

    estimatedCost: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Assigned", "In Progress", "Completed"],
      default: "Pending"
    },

    reason: { type: String, default: "" },
    assignedMechanic: { type: String, default: "" },
    mechanicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    workNote: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
