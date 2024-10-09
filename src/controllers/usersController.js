class UsersController {
  constructor(service, validator, logger) {
    this._service = service;
    this._validator = validator;
    this._logger = logger;
  }

  async postUserController(request, response, next) {
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

  async getUsersByIdController(request, response, next) {
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
