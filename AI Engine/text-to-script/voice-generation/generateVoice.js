const { cleanText } = require("./voiceUtils");

const generateVoice = async (text) => {
  const cleanedText = cleanText(text);

  return {
    audioPath: "storage/audio/narration.mp3",
    textProcessed: cleanedText
  };
};

module.exports = generateVoice;