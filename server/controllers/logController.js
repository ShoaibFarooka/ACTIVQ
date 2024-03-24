const Logs = require("../models/logModel");

const updateLogForId = async (id) => {
  try {
    // Append current time to the log of the given user's id
    const existingLog = await Logs.findOne({ id });

    if (!existingLog) {
      try {
        // Create log object for id
        await Logs.create({ id, loginTime: [new Date().toISOString()] });
      } catch (error) {
        console.error("Error creating log for id:", error);
      }
    } else {
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
