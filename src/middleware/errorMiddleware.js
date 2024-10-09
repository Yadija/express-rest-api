import ClientError from "../exceptions/ClientError.js";
import { logger } from "../application/logging.js";

const errorMiddleware = async (error, request, response, next) => {
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

  // Log error
  logger.error(
    `Status Code ${statusCode} - ${message} - ${request.method} ${request.originalUrl}`,
  );
  response.status(statusCode).json(errorResponse).end();
};

export default errorMiddleware;
