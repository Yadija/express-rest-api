import express from "express";
// middleware
import errorMiddleware from "../middleware/errorMiddleware";
// routes
import userRouter from "../routes/users";
import authenticationRouter from "../routes/authentications";

export const web = express();
web.use(express.json());

web.use("/users", userRouter);
web.use("/auth", authenticationRouter);

web.use(errorMiddleware);
