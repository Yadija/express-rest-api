import express from "express";
// application
import { logger } from "../application/logging";
// controllers
import AuthenticationsController from "../controllers/authenticationsController";
// services
import AuthenticationsService from "../services/authenticationsService";
import UsersService from "../services/usersService";
// tokenize
import tokenManager from "../tokenize/tokenManager";
// validator
import AuthenticationsValidator from "../validator/authentications/index";

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
