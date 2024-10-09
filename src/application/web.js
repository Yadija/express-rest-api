import express from "express";
// middleware
import errorMiddleware from "../middleware/errorMiddleware.js";

export const web = express();
web.use(express.json());

web.use(errorMiddleware);
