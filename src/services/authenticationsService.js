import ms from "ms";
import { TokenType } from "@prisma/client";
// application
import { prismaClient } from "../application/database.js";
// exceptions
import InvariantError from "../exceptions/InvariantError.js";

class AuthenticationsService {
  async addRefreshToken(token, userId) {
    const refreshTokenAge = process.env.REFRESH_TOKEN_AGE || "30d";
    const expirationDuration = ms(refreshTokenAge);

    if (!expirationDuration) {
      throw new InvariantError("invalid REFRESH_TOKEN_AGE value");
    }

    const expiredIn = new Date(Date.now() + expirationDuration);

    await prismaClient.token.create({
      data: {
        token,
        type: TokenType.REFRESH_TOKEN,
        user: {
          connect: { id: userId },
        },
        expiredIn,
      },
    });
  }

  async verifyRefreshToken(token) {
    const existingToken = await prismaClient.token.findFirst({
      where: { token },
    });

    if (!existingToken) {
      throw new InvariantError("invalid refresh token");
    }
  }

  async deleteRefreshToken(token) {
    await prismaClient.token.deleteMany({
      where: { token },
    });
  }
}

export default AuthenticationsService;
