import express from "express";
// application
import { logger } from "../application/logging.js";
// controller
import ThreadsController from "../controllers/threadsController.js";
// middleware
import authenticationMiddleware from "../middleware/authenticationMiddleware.js";
// services
import ThreadsService from "../services/threadsService.js";
// validator
import TheadsValidator from "../validator/threads/index.js";

// inject dependencies
const threadsService = new ThreadsService();
const threadsController = new ThreadsController(
  threadsService,
  TheadsValidator,
  logger,
);

const threadRouter = express.Router();
threadRouter.get("/", (request, response, next) =>
  threadsController.getThreadsController(request, response, next),
);
threadRouter.get("/:threadId", (request, response, next) =>
  threadsController.getThreadByIdController(request, response, next),
);

threadRouter.use(authenticationMiddleware); // use authentication middleware for below routes
threadRouter.post("/", (request, response, next) =>
  threadsController.postThreadController(request, response, next),
);
threadRouter.put("/:threadId", (request, response, next) =>
  threadsController.putThreadByIdController(request, response, next),
);
threadRouter.delete("/:threadId", (request, response, next) =>
  threadsController.deleteThreadByIdController(request, response, next),
);

export default threadRouter;
