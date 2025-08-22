const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    device_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: String,
      required: true,
      enum: ["units_consumed", "status_change", "error", "other"], // extend as needed
    },
    value: {
      type: Number, // works for numeric values like units consumed
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

const Log = mongoose.model("Log", logSchema);

module.exports = Log;
