import bcrypt from "bcrypt";
// utils
import users from "../src/utils/users.js";
import tokens from "../src/utils/authentications.js";
import threads from "../src/utils/threads.js";

export const createTestUser = () => {
  const user = {
    id: "user-123",
    username: "johndoe",
    fullname: "John Doe",
    password: bcrypt.hashSync("secret", 10),
  };

  users.push(user);
};

export const createAnotherTestUser = () => {
  const user = {
    id: "user-456",
    username: "janedoe",
    fullname: "Jane Doe",
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

export const createManyTestThreads = () => {
  for (let i = 0; i < 5; i++) {
    threads.push({
      id: `thread-${i + 1}`,
      content: `Hello World ${i + 1}`,
      owner: "user-123",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
};

export const createAnotherManyTestThreads = () => {
  for (let i = 0; i < 5; i++) {
    threads.push({
      id: `thread-${i + 6}`,
      content: `Hello World ${i + 6}`,
      owner: "user-456",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
};

export const createTestThread = () => {
  threads.push({
    id: "thread-123",
    content: "Hello World",
    owner: "user-123",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};

export const getTestThread = () => {
  return threads.find((thread) => thread.id === "thread-123");
};

export const removeAllTestThreads = () => {
  threads.length = 0;
};
