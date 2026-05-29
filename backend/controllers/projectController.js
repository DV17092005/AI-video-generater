const {
  createProject,
  getProjects
} = require("../../DATABASE/users/projects/projectRepository");

const create = async (req, res) => {
  const project = await createProject(req.body);
  res.status(201).json(project);
};

const list = async (req, res) => {
  const userId = req.user?.id;
  const projects = await getProjects(userId);
  res.json(projects);
};

module.exports = {
  create,
  list
};