import jwt from "jsonwebtoken";
// exceptions
import InvariantError from "../../../express-rest-api/src/exceptions/InvariantError.js";

const tokenManager = {
  generateTokens: (payload) => {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: process.env.ACCESS_TOKEN_AGE || "15m",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
      expiresIn: process.env.REFRESH_TOKEN_AGE || "7d",
    });

    return {
      accessToken,
      refreshToken,
    };
  },
  verifyRefreshToken: (refreshToken) => {
    try {
      const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);

      return payload;
    } catch {
      throw new InvariantError("invalid refresh token");
    }
  },
};

export default tokenManager;
