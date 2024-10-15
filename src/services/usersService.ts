import bcrypt from "bcrypt";
// application
import { prismaClient } from "../application/database";
// exceptions
import AuthenticationError from "../exceptions/AuthenticationError";
import InvariantError from "../exceptions/InvariantError";
import NotFoundError from "../exceptions/NotFoundError";
// interface
import { AddUserInterface } from "../interface/userInterface";

class UsersService {
  async addUser({ username, password, fullname }: AddUserInterface) {
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await prismaClient.user.create({
        data: {
          username,
          password: hashedPassword,
          fullname,
        },
        select: {
          id: true,
          username: true,
          fullname: true,
        },
      });

      return user;
    } catch {
      throw new Error("user addition failed");
    }
  }

  async verifyNewUsername(username: string) {
    const user = await prismaClient.user.findUnique({
      where: { username },
    });

    if (user) {
      throw new InvariantError("username already exists");
    }
  }

  async getUserById(userId: string) {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        fullname: true,
      },
    });

    if (!user) {
      throw new NotFoundError("cannot find user");
    }

    return user;
  }

  async verifyUserCredential(username: string, password: string) {
    const user = await prismaClient.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        fullname: true,
      },
    });

    if (!user) {
      throw new AuthenticationError("username or password incorrect");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new AuthenticationError("username or password incorrect");
    }

    const { id, fullname } = user;
    return { id, username, fullname };
  }
}

export default UsersService;
