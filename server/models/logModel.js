const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    loginTime: {
      type: [String],
      required: true,
    },
  }
);

const Logs = new mongoose.model("Log", logSchema);
module.exports = Logs;
