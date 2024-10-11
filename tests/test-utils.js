import bcrypt from "bcrypt";
// application
import { prismaClient } from "../src/application/database.js";

export const createTestUser = async () => {
  await prismaClient.user.create({
    data: {
      id: "user-123",
      username: "johndoe",
      password: await bcrypt.hash("secretpassword", 10),
      fullname: "John Doe",
    },
  });
};

export const createAnotherTestUser = async () => {
  await prismaClient.user.create({
    data: {
      id: "user-456",
      username: "janedoe",
      password: await bcrypt.hash("secretpassword", 10),
      fullname: "Jane Doe",
    },
  });
};

export const getTestUserById = async () => {
  const user = await prismaClient.user.findUnique({
    where: { id: "user-123" },
  });

  return user;
};

export const removeAllTestUsers = async () => {
  await prismaClient.user.deleteMany({});
};

export const removeAllTestAuthentication = async () => {
  await prismaClient.token.deleteMany({});
};

export const createManyTestThreads = async () => {
  for (let i = 0; i < 5; i++) {
    await prismaClient.thread.create({
      data: {
        content: `Hello World ${i}`,
        owner: "user-123",
      },
    });
  }
};

export const createAnotherManyTestThreads = async () => {
  for (let i = 0; i < 5; i++) {
    await prismaClient.thread.create({
      data: {
        content: `Hello World ${i}`,
        owner: "user-456",
      },
    });
  }
};

export const createTestThread = async () => {
  await prismaClient.thread.create({
    data: {
      id: "thread-123",
      content: "Hello World",
      owner: "user-123",
    },
  });
};

export const getTestThread = async () => {
  const thread = await prismaClient.thread.findUnique({
    where: { id: "thread-123" },
  });

  return thread;
};

export const removeAllTestThreads = async () => {
  await prismaClient.thread.deleteMany({});
};
