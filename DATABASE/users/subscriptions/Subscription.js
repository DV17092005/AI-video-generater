const mongoose = require("../../mongoose");

const SubscriptionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },

  plan: {
    type: String,
    enum: ["free", "basic", "pro"],
    default: "free"
  },

  expiryDate: {
    type: Date,
    default: null // Free plan never expires
  },

  limits: {
    maxVideosPerMonth: {
      type: Number,
      default: 5
    },

    maxStorageMB: {
      type: Number,
      default: 500
    },

    maxVideoDurationMinutes: {
      type: Number,
      default: 2
    }
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model(
  "Subscription",
  SubscriptionSchema
);