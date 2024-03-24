const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      ref: "User",
      required: true,
    },
    loginTime: {
      type: [String],
      default: [],
      required: true
    },
  },
  { timestamps: true }
);

const Logs = new mongoose.model("Log", logSchema);
module.exports = Logs;