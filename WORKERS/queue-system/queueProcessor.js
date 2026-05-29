require("dotenv").config();
const videoQueue = require("./queue");
const { runAI } = require("./ai-worker/aiWorker");
const { renderVideo } = require("./render-worker/renderWorker");

videoQueue.process(3, async (job) => {
  console.log("Processing job", job.id, job.data);

  const { prompt, renderOutput } = job.data;
  job.progress(10);

  try {
    const aiResult = await runAI(prompt);
    job.progress(50);

    const imagePaths = Array.isArray(aiResult.images)
      ? aiResult.images.map((image) => image.imagePath)
      : [];

    const renderResult = imagePaths.length
      ? await renderVideo(imagePaths, renderOutput || "storage/videos/final.mp4")
      : { output: renderOutput || "storage/videos/final.mp4" };

    job.progress(100);

    return {
      status: "completed",
      aiResult,
      renderResult
    };
  } catch (error) {
    console.error("Job failed", job.id, error);
    throw error;
  }
});