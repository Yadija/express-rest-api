import express from "express";
// controller
import threadsController from "../controllers/threadsController.js";
// middleware
import authenticationMiddleware from "../middleware/authenticationMiddleware.js";

const threadRouter = express.Router();

threadRouter.get("/", threadsController.getThreadsController);
threadRouter.get("/:threadId", threadsController.getThreadByIdController);

threadRouter.use(authenticationMiddleware); // use authentication middleware for below routes
threadRouter.post("/", threadsController.postThreadController);
threadRouter.put("/:threadId", threadsController.putThreadByIdController);
threadRouter.delete("/:threadId", threadsController.deleteThreadByIdController);

export default threadRouter;
