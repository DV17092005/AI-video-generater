const Project = require("./Project");

const createProject = async (data) => {
  return await Project.create(data);
};

const getProjects = async (userId) => {
  return await Project.find({ userId });
};

module.exports = {
  createProject,
  getProjects
};
