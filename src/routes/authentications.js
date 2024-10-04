import express from "express";
// controllers
import authenticationsController from "../controllers/authenticationsController.js";

const authenticationRouter = express.Router();
authenticationRouter.post(
  "/login",
  authenticationsController.postAuthenticationController,
);
authenticationRouter.put(
  "/refresh",
  authenticationsController.putAuthenticationController,
);
authenticationRouter.delete(
  "/logout",
  authenticationsController.deleteAuthenticationController,
);

export default authenticationRouter;
