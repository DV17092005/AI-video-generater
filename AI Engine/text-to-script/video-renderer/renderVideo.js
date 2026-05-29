const composeScenes = require("./sceneComposer");

const renderVideo = async (images, audio) => {
  const project = composeScenes(images, audio);

  return {
    status: "rendered",
    project
  };
};

module.exports = renderVideo;