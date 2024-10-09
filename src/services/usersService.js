import bcrypt from "bcrypt";
// application
import { prismaClient } from "../application/database.js";
// exceptions
import InvariantError from "../exceptions/InvariantError.js";
import NotFoundError from "../exceptions/NotFoundError.js";

class UsersService {
  async addUser({ username, password, fullname }) {
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

  async verifyNewUsername(username) {
    const user = await prismaClient.user.findUnique({
      where: { username },
    });

    if (user) {
      throw new InvariantError("username already exists");
    }
  }

  async getUserById(userId) {
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
}

export default UsersService;
