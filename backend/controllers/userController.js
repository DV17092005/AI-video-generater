const {
  createUser,
  getUsers
} = require("../../DATABASE/users/userRepository");

const list = async (req, res) => {
  const users = await getUsers();
  res.json(users);
};

const create = async (req, res) => {
  const user = await createUser(req.body);
  res.status(201).json(user);
};

module.exports = {
  list,
  create
};