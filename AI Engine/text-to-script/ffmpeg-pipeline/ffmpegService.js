const ffmpeg = require("fluent-ffmpeg");

const createVideo = (
  imageArray,
  audioFile,
  outputFile
) => {
  return new Promise((resolve, reject) => {
    let command = ffmpeg();

    imageArray.forEach((imagePath) => {
      command = command.input(imagePath);
    });

    command
      .input(audioFile)
      .outputOptions(["-c:v", "libx264", "-pix_fmt", "yuv420p"])
      .output(outputFile)
      .on("end", () => resolve({ outputFile }))
      .on("error", (err) => reject(err))
      .run();
  });
};

module.exports = {
  createVideo
};