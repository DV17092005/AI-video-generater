const mergeAssets = async (images, audio, subtitles) => {
  return {
    status: "merged",
    output: "storage/videos/final.mp4",
    assets: {
      imageCount: images.length,
      audioPath: audio.audioPath,
      subtitlePath: subtitles.subtitlePath
    }
  };
};

module.exports = mergeAssets;