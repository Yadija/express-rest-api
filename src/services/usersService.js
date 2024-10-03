import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
// exceptions
import InvariantError from "../exceptions/InvariantError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
// utils
import users from "../utils/users.js";

const verifyNewUsername = (username) => {
  const index = users.findIndex((user) => user.username === username);

  if (index !== -1) {
    throw new InvariantError("username already exists");
  }
};

const addUser = ({ username, password, fullname }) => {
  const id = `user-${nanoid(15)}`;
  const hashedPassword = bcrypt.hashSync(password, 10);

  users.push({
    id,
    username,
    password: hashedPassword,
    fullname,
  });

  return {
    id,
    username,
    fullname,
  };
};

const getUserById = (userId) => {
  const index = users.findIndex((user) => user.id === userId);

  if (index === -1) {
    throw new NotFoundError("Cannot find user");
  }

  const { id, username, fullname } = users[index];
  return { id, username, fullname };
};

export default { addUser, getUserById, verifyNewUsername };
