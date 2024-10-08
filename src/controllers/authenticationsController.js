// application
import { logger } from "../application/logging.js";
// services
import authenticationsService from "../services/authenticationsService.js";
import usersService from "../services/usersService.js";
// token
import tokenManager from "../tokenize/tokenManager.js";
// validator
import AuthenticationsValidator from "../validator/authentication/index.js";

const postAuthenticationController = (request, response, next) => {
  try {
    const payload = AuthenticationsValidator.validatePostAuthenticationPayload(
      request.body,
    );

    const { username, password } = payload;
    const user = usersService.verifyUserCredential(username, password);

    const tokens = tokenManager.generateTokens(user);
    authenticationsService.addRefreshToken(tokens.refreshToken);

    logger.info(`login success with username ${username}`);
    response.status(200).json({
      status: "success",
      message: "login success",
      timestamp: new Date().toISOString(),
      data: {
        ...user,
        ...tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

const putAuthenticationController = (request, response, next) => {
  try {
    const payload = AuthenticationsValidator.validatePutAuthenticationPayload(
      request.body,
    );

    const { refreshToken } = payload;
    authenticationsService.verifyRefreshToken(refreshToken);

    const { id, username, fullname } =
      tokenManager.verifyRefreshToken(refreshToken);
    authenticationsService.deleteRefreshToken(refreshToken);

    const tokens = tokenManager.generateTokens({ id, username, fullname });
    authenticationsService.addRefreshToken(tokens.refreshToken);

    logger.info(`refresh token successfully with username ${username}`);
    response.status(200).json({
      status: "success",
      message: "refresh token successfully",
      timestamp: new Date().toISOString(),
      data: {
        id,
        username,
        fullname,
        ...tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteAuthenticationController = (request, response, next) => {
  try {
    const payload =
      AuthenticationsValidator.validateDeleteAuthenticationPayload(
        request.body,
      );

    const { refreshToken } = payload;
    authenticationsService.verifyRefreshToken(refreshToken);
    const { username } = tokenManager.verifyRefreshToken(refreshToken);
    authenticationsService.deleteRefreshToken(refreshToken);

    logger.info(`logout successfully with username ${username}`);
    response.status(200).json({
      status: "success",
      message: "logout successfully",
      timestamp: new Date().toISOString(),
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  postAuthenticationController,
  putAuthenticationController,
  deleteAuthenticationController,
};
