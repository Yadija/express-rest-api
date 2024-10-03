import express from "express";
import errorMiddleware from "../middleware/errorMiddleware.js";

// routes
import userRouter from "../routes/users.js";

export const web = express();
web.use(express.json());

web.use("/users", userRouter);

web.use(errorMiddleware);
