const Logs = require("../models/logModel");
const User = require("../models/userModel");

const updateLogForId = async (id) => {
  try {
    // Append current time to the log of the given user's id
    const existingLog = await Logs.findOne({ userId: id });

    if (!existingLog) {
      try {
        // Create log object for id
        const user = await User.findOne({ _id: id });
        await Logs.create({ userId: id, loginTime: [new Date().toISOString()], username: user.name });
      } catch (error) {
        console.error("Error creating log for id:", error);
      }
    } else {
      // Remove if not needed to correct earlier cases..
      if (!existingLog.username) {
        const user = await User.findOne({ _id: id });
        existingLog.username = user.name;
      }
      existingLog.loginTime.push(new Date().toISOString());
      await existingLog.save();
    }
  } catch (error) {
    console.error("Error updating log for id:", error);
  }
};

module.exports = {
  updateLogForId,
};
