import bcrypt from "bcrypt";
// utils
import users from "../src/utils/users.js";

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
