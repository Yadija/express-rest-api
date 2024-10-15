import jwt from "jsonwebtoken";
// exceptions
import InvariantError from "../exceptions/InvariantError";
// interface
import { TokenManager, UserPayload } from "../interface/tokenManagerInterface";

const tokenManager: TokenManager = {
  generateTokens: (payload) => {
    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_KEY as string,
      {
        expiresIn: process.env.ACCESS_TOKEN_AGE || "15m",
      },
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_KEY as string,
      {
        expiresIn: process.env.REFRESH_TOKEN_AGE || "7d",
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  },
  verifyRefreshToken: (refreshToken) => {
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY as string,
      ) as jwt.JwtPayload & UserPayload;

      return payload;
    } catch {
      throw new InvariantError("invalid refresh token");
    }
  },
};

export default tokenManager;
