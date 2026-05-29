const { saveFile } = require("../../STORAGE SERVICE/storageService");

const uploadFile = async (folder, fileName, data) => {
  const savedPath = await saveFile(folder, fileName, data);

  return {
    url: savedPath
  };
};

module.exports = {
  uploadFile
};