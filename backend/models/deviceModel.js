const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "inactive",
    },
    last_active_at: {
      type: Date,
      default: null,
    },
    owner_id: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: "User",
      required: true,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

const Device = mongoose.model("Device", deviceSchema);

module.exports = Device;
