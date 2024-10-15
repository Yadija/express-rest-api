import { NextFunction, Request, Response } from "express";
// application
import { logger } from "../application/logging";
// exceptions
import ClientError from "../exceptions/ClientError";

const errorMiddleware = async (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (!error) {
    next();
    return;
  }

  const isClientError = error instanceof ClientError;

  const statusCode = isClientError ? error.statusCode : 500;
  const message = isClientError ? error.message : "Internal Server Error";

  const errorResponse = {
    status: "fail",
    message: message,
    timestamp: new Date().toISOString(),
    path: request.originalUrl,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  };

  // log error
  logger.error(
    `Status Code ${statusCode} - ${message} - ${request.method} ${request.originalUrl}`,
  );
  response.status(statusCode).json(errorResponse).end();
};

export default errorMiddleware;
