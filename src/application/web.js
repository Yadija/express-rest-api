import express from "express";
// middleware
import errorMiddleware from "../middleware/errorMiddleware.js";
// routes
import userRouter from "../routes/users.js";
import authenticationRouter from "../routes/authentications.js";

export const web = express();
web.use(express.json());

web.use("/users", userRouter);
web.use("/auth", authenticationRouter);

web.use(errorMiddleware);
