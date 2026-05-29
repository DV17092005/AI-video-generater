const { enqueueVideo } = require("../services/videoService");

const generate = async (req, res) => {
  try {
    const prompt = req.body.prompt || req.body.projectPrompt;
    const userId = req.user?.id || null;
    const result = await enqueueVideo(prompt, userId);

    res.status(202).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  generate
};