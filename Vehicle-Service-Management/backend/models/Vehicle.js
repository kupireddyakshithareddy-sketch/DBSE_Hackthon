
const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    registration_number: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },

    brand: {
      type: String,
      required: true,
      trim: true
    },

    model: {
      type: String,
      required: true,
      trim: true
    },

    vehicle_year: {
      type: Number,
      default: null
    },

    current_km: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

vehicleSchema.index(
  { userId: 1, registration_number: 1 },
  { unique: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
