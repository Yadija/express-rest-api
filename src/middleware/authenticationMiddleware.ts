import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
// exceptions
import AuthenticationError from "../exceptions/AuthenticationError";

declare module "express-serve-static-core" {
  interface Request {
    credentialId: string;
  }
}

const authenticationMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = request.get("Authorization");
    if (!authHeader) throw new AuthenticationError("unauthorized");

    const accessToken = authHeader.split(" ")[1];
    const { id } = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_KEY as string,
    ) as { id: string };

    request.credentialId = id;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AuthenticationError("invalid access token"));
    }

    next(error);
  }
};

export default authenticationMiddleware;
