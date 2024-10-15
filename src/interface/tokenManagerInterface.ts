import jwt from "jsonwebtoken";

export interface UserPayload {
  id: string;
  username: string;
  fullname: string;
}

export interface TokenManager {
  generateTokens: (payload: UserPayload) => {
    accessToken: string;
    refreshToken: string;
  };
  verifyRefreshToken: (refreshToken: string) => jwt.JwtPayload & UserPayload;
}
