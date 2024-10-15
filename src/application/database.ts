import { PrismaClient } from "@prisma/client";
import { logger } from "./logging";

export const prismaClient = new PrismaClient({
  log: [
    { emit: "event", level: "query" },
    { emit: "event", level: "error" },
    { emit: "event", level: "info" },
    { emit: "event", level: "warn" },
  ],
});

prismaClient.$on("error", (error) => {
  logger.error(error.message);
});

prismaClient.$on("warn", (warn) => {
  logger.warn(warn.message);
});

prismaClient.$on("info", (info) => {
  logger.info(info.message);
});

prismaClient.$on("query", (query) => {
  logger.info(
    `(duration: ${query.duration}ms) query: ${query.query}, params: ${JSON.stringify(query.params)}`,
  );
});
