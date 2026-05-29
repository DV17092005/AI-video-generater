const Queue = require("bull");

const VIDEO_QUEUE_URL = process.env.REDIS_URL || "redis://redis:6379";

const videoQueue = new Queue("video-generation", VIDEO_QUEUE_URL, {
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000
    },
    removeOnComplete: true,
    removeOnFail: false
  },
  settings: {
    lockDuration: 300000,
    stalledInterval: 30000,
    maxStalledCount: 2
  }
});

module.exports = videoQueue;