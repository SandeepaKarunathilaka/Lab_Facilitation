const mongoose = require("mongoose");

const labServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    available: { type: Boolean, required: true, default: true },
    duration: { type: Number, required: true },
    preparationRequired: { type: Boolean, required: true, default: false },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LabService", labServiceSchema);
