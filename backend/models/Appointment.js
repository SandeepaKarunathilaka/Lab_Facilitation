const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    labService: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LabService",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: { type: String, required: true },
    date: { type: String, required: false },
    status: {
      type: String,
      required: true,
      default: "pending",
      enum: ["pending", "approved", "inProgress", "completed", "cancelled"],
    },
    report: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
