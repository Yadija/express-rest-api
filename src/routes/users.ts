import express from "express";
// application
import { logger } from "../application/logging";
// controllers
import UsersController from "../controllers/usersController";
// services
import UsersService from "../services/usersService";
// validator
import UsersValidator from "../validator/users/index";

// inject dependencies
const usersService = new UsersService();
const usersController = new UsersController(
  usersService,
  UsersValidator,
  logger,
);

const userRouter = express.Router();
userRouter.post("/", (request, response, next) =>
  usersController.postUserController(request, response, next),
);
userRouter.get("/:userId", (request, response, next) =>
  usersController.getUsersByIdController(request, response, next),
);

export default userRouter;
