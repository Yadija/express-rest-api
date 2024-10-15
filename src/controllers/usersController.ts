import { NextFunction, Request, Response } from "express";
// interface
import { Logger } from "../interface/loggerInterface";
// services
import UsersService from "../services/usersService";
// validator
import UsersValidator from "../validator/users/index";

class UsersController {
  private _service;
  private _validator;
  private _logger;

  constructor(
    service: UsersService,
    validator: typeof UsersValidator,
    logger: Logger,
  ) {
    this._service = service;
    this._validator = validator;
    this._logger = logger;
  }

  async postUserController(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const payload = this._validator.validateUserPayload(request.body);
      await this._service.verifyNewUsername(payload.username);
      const user = await this._service.addUser(payload);

      this._logger.info(
        `user ${payload.username} with id ${user.id} created successfully`,
      );
      response.status(201).json({
        status: "success",
        message: "user created successfully",
        timestamp: new Date().toISOString(),
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getUsersByIdController(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { userId } = request.params;
      const user = await this._service.getUserById(userId);

      this._logger.info(`get user by id ${userId} successfully`);
      response.status(200).json({
        status: "success",
        message: "get user by id successfully",
        timestamp: new Date().toISOString(),
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default UsersController;
