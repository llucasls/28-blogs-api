const { hash } = require('bcryptjs');
const { User } = require('../models');
const { newToken } = require('../auth');
const { userValidate } = require('../validations');
const HTTPError = require('../utils/httpError.js');

const readOne = async (id) => {
  const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
  if (!user) throw new HTTPError(404, 'User does not exist');
  return user;
};

const readAll = async () => {
  const users = await User
    .findAll({ attributes: { exclude: ['password'] } });
  return users;
};

const createOne = async (user) => {
  userValidate(user);
  const password = await hash(user.password, 8);
  const userData = { ...user, password };
  let foundUser;
  await User.findOne({ where: { email: user.email } })
    .then((dbUser) => { foundUser = dbUser.get(); })
    .catch(() => { foundUser = null; });
  if (foundUser) throw new HTTPError(409, 'User already registered');
  await User.create(userData);
  const { id } = await User.findOne({ where: { email: user.email } });
  delete userData.password;
  const token = newToken({ id, ...userData });
  return token;
};

const deleteOne = async (email) => {
  await User.destroy({ where: { email } });
};

module.exports = { readOne, readAll, createOne, deleteOne };
