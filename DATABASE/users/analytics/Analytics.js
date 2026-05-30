const mongoose = require("../../mongoose");

const AnalyticsSchema =
new mongoose.Schema({

  userId: String,

  videosGenerated: Number,

  storageUsed: Number,

  totalMinutesRendered: Number
});

module.exports =
mongoose.model(
  "Analytics",
  AnalyticsSchema
);