import express from "express";
// application
import { logger } from "../application/logging.js";
// controllers
import AuthenticationsController from "../controllers/authenticationsController.js";
// services
import AuthenticationsService from "../services/authenticationsService.js";
import UsersService from "../services/usersService.js";
// validator
import AuthenticationsValidator from "../validator/authentications/index.js";
// tokenize
import tokenManager from "../tokenize/tokenManager.js";

// inject dependencies
const authenticationsService = new AuthenticationsService();
const usersService = new UsersService();
const authenticationsController = new AuthenticationsController(
  authenticationsService,
  usersService,
  tokenManager,
  AuthenticationsValidator,
  logger,
);

const authenticationRouter = express.Router();
authenticationRouter.post("/login", (request, response, next) =>
  authenticationsController.postAuthenticationController(
    request,
    response,
    next,
  ),
);
authenticationRouter.put("/refresh", (request, response, next) =>
  authenticationsController.putAuthenticationController(
    request,
    response,
    next,
  ),
);
authenticationRouter.delete("/logout", (request, response, next) =>
  authenticationsController.deleteAuthenticationController(
    request,
    response,
    next,
  ),
);

export default authenticationRouter;
