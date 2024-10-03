import express from "express";
// controllers
import usersController from "../controllers/usersController.js";

const userRouter = express.Router();
userRouter.post("/", usersController.postUserController);
userRouter.get("/:userId", usersController.getUsersByIdController);

export default userRouter;
