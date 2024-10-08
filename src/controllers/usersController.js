// application
import { logger } from "../application/logging.js";
// services
import usersService from "../services/usersService.js";
// validator
import UsersValidator from "../validator/users/index.js";
const postUserController = (request, response, next) => {
  try {
    const payload = UsersValidator.validateUserPayload(request.body);
    usersService.verifyNewUsername(payload.username);
    const user = usersService.addUser(payload);

    logger.info(
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
};

const getUsersByIdController = (request, response, next) => {
  try {
    const { userId } = request.params;

    const user = usersService.getUserById(userId);

    logger.info(`get user by id ${userId} successfully`);
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
};

export default { postUserController, getUsersByIdController };
