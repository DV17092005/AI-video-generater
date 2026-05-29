const fs = require("fs").promises;
const path = require("path");

const saveFile = async (folder, fileName, data) => {
  const filePath = path.join(folder, fileName);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, data);
  return filePath;
};

module.exports = {
  saveFile
};