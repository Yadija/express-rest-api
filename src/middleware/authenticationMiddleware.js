import jwt from "jsonwebtoken";
// exceptions
import AuthenticationError from "../exceptions/AuthenticationError.js";

const authenticationMiddleware = async (request, response, next) => {
  try {
    const authHeader = request.get("Authorization");
    if (!authHeader) throw new AuthenticationError("unauthorized");

    const accessToken = authHeader.split(" ")[1];
    const { id } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);

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
