import bcrypt from "bcrypt";
// utils
import users from "../src/utils/users.js";
import tokens from "../src/utils/authentications.js";

export const createTestUser = () => {
  const user = {
    id: "user-123",
    username: "johndoe",
    fullname: "John Doe",
    password: bcrypt.hashSync("secret", 10),
  };

  users.push(user);
};

export const getTestUserById = () =>
  users.find((user) => user.id === "user-123");

export const removeAllTestUsers = () => {
  users.length = 0;
};

export const removeAllTestAuthentication = () => {
  tokens.length = 0;
};
