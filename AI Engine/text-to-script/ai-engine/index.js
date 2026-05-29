const generateScript = require("../generateScript");
const generateImages = require("../image-generation/generateImages");
const generateVoice = require("../voice-generation/generateVoice");
const generateSubtitles = require("../subtitle-generator/generateSubtitles");
const mergeAssets = require("../ffmpeg-pipeline/mergeAssets");

async function createVideo(prompt) {
  const script = await generateScript(prompt);

  const [images, voice, subtitles] = await Promise.all([
    generateImages(script.scenes),
    generateVoice(JSON.stringify(script)),
    generateSubtitles(script)
  ]);

  const video = await mergeAssets(images, voice, subtitles);

  return {
    script,
    images,
    voice,
    subtitles,
    video
  };
}

module.exports = {
  createVideo
};