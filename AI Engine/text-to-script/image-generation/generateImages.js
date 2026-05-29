const { resizeImage } = require("./imageUtils");

const generateImages = async (scenes) => {
  return scenes.map((scene, index) => {
    const imagePath = `storage/images/scene-${index}.png`;
    resizeImage(imagePath);
    return {
      sceneId: scene.id,
      imagePath
    };
  });
};

module.exports = generateImages;