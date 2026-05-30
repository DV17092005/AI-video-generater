const mongoose = require("../../mongoose");

const ProjectSchema =
new mongoose.Schema({

  userId: String,

  title: String,

  prompt: String,

  status: {
    type: String,
    default: "pending"
  },

  videoUrl: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports =
mongoose.model(
  "Project",
  ProjectSchema
);