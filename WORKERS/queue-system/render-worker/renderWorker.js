const ffmpeg = require("fluent-ffmpeg");

const renderVideo = async (input, output) => {
  return new Promise((resolve, reject) => {
    const command = ffmpeg();

    if (Array.isArray(input)) {
      input.forEach((item) => command.input(item));
    } else {
      command.input(input);
    }

    command
      .output(output)
      .videoCodec("libx264")
      .audioCodec("aac")
      .outputOptions(["-pix_fmt yuv420p", "-movflags +faststart"])
      .on("progress", (progress) => {
        if (progress.percent) {
          console.log(`Rendering ${Math.round(progress.percent)}%`);
        }
      })
      .on("end", () => resolve({ output }))
      .on("error", (err) => reject(err))
      .run();
  });
};

module.exports = {
  renderVideo
};