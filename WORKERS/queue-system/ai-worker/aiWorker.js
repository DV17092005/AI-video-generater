const path = require("path");
const { createVideo } = require(path.join(__dirname, "..", "..", "..", "AI Engine", "text-to-script", "ai-engine"));

const runAI = async (prompt) => {
  if (!prompt) {
    throw new Error("Missing prompt for AI worker");
  }

  return createVideo(prompt);
};

module.exports = {
  runAI
};