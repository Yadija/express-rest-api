import bcrypt from "bcrypt";
// application
import { prismaClient } from "../src/application/database";

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

  if (!user) {
    throw new Error("cannot find user");
  }

  return user;
};

export const removeAllTestUsers = async () => {
  await prismaClient.user.deleteMany({});
};

export const removeAllTestAuthentication = async () => {
  await prismaClient.token.deleteMany({});
};
