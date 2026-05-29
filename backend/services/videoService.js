const videoQueue = require("../../WORKERS/queue-system/queue");

const enqueueVideo = async (prompt, userId) => {
  if (!prompt) {
    throw new Error("Missing prompt for video generation");
  }

  const job = await videoQueue.add({ prompt, userId });
  return {
    jobId: job.id,
    status: "queued"
  };
};

module.exports = {
  enqueueVideo
};