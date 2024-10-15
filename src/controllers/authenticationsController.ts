import { NextFunction, Request, Response } from "express";
// interface
import { Logger } from "../interface/loggerInterface";
import { TokenManager } from "../interface/tokenManagerInterface";
// services
import AuthenticationsService from "../services/authenticationsService";
import UsersService from "../services/usersService";
// validator
import AuthenticationsValidator from "../validator/authentications/index";

class AuthenticationsController {
  private _authenticationsService;
  private _usersService;
  private _tokenManager;
  private _validator;
  private _logger;

  constructor(
    authenticationsService: AuthenticationsService,
    usersService: UsersService,
    tokenManager: TokenManager,
    validator: typeof AuthenticationsValidator,
    logger: Logger,
  ) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;
    this._logger = logger;
  }

  async postAuthenticationController(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const payload = this._validator.validatePostAuthenticationPayload(
        request.body,
      );

      const { username, password } = payload;
      const user = await this._usersService.verifyUserCredential(
        username,
        password,
      );

      const tokens = this._tokenManager.generateTokens(user);
      await this._authenticationsService.addRefreshToken(
        tokens.refreshToken,
        user.id,
      );

      this._logger.info(`login success with username ${username}`);
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
  }

  async putAuthenticationController(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const payload = this._validator.validatePutAuthenticationPayload(
        request.body,
      );

      const { refreshToken } = payload;
      await this._authenticationsService.verifyRefreshToken(refreshToken);

      const { id, username, fullname } =
        this._tokenManager.verifyRefreshToken(refreshToken);
      await this._authenticationsService.deleteRefreshToken(refreshToken);

      const tokens = this._tokenManager.generateTokens({
        id,
        username,
        fullname,
      });
      await this._authenticationsService.addRefreshToken(
        tokens.refreshToken,
        id,
      );

      this._logger.info(`refresh token successfully with username ${username}`);
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
  }

  async deleteAuthenticationController(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const payload = this._validator.validateDeleteAuthenticationPayload(
        request.body,
      );

      const { refreshToken } = payload;
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      const { username } = this._tokenManager.verifyRefreshToken(refreshToken);
      await this._authenticationsService.deleteRefreshToken(refreshToken);

      this._logger.info(`logout successfully with username ${username}`);
      response.status(200).json({
        status: "success",
        message: "logout successfully",
        timestamp: new Date().toISOString(),
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthenticationsController;
