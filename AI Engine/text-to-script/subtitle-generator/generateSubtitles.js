const createSRT = require("./srtGenerator");

const generateSubtitles = async (script) => {
  const lines = script.scenes.map((scene) => scene.narration);
  const subtitleContent = createSRT(lines);

  return {
    subtitlePath: "storage/subtitles/story.srt",
    content: subtitleContent
  };
};

module.exports = generateSubtitles;