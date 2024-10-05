import express from "express";
import errorMiddleware from "../middleware/errorMiddleware.js";

// routes
import userRouter from "../routes/users.js";
import authenticationRouter from "../routes/authentications.js";
import threadRouter from "../routes/threads.js";

export const web = express();
web.use(express.json());

web.use("/users", userRouter);
web.use("/auth", authenticationRouter);
web.use("/threads", threadRouter);

web.use(errorMiddleware);
