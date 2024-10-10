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

export const getTestUserById = async () => {
  const user = await prismaClient.user.findUnique({
    where: { id: "user-123" },
  });

  return user;
};

export const removeAllTestUsers = async () => {
  await prismaClient.user.deleteMany({});
};
