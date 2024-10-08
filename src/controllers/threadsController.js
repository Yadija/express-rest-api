// application
import { logger } from "../application/logging.js";
// services
import threadsService from "../services/threadsService.js";
// validator
import ThreadsValidator from "../validator/threads/index.js";

const postThreadController = (request, response, next) => {
  try {
    const payload = ThreadsValidator.validateThreadPayload(request.body);

    const { content } = payload;
    const { credentialId: owner } = request;

    const thread = threadsService.addthread(content, owner);

    logger.info(`thread created with id ${thread.id} by ${owner}`);
    response.status(201).json({
      status: "success",
      message: "thread created successfully",
      timestamp: new Date().toISOString(),
      data: {
        thread,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getThreadsController = (request, response, next) => {
  try {
    const threads = threadsService.getAllThreads();

    logger.info("get threads successfully");
    response.status(200).json({
      status: "success",
      message: "get threads successfully",
      timestamp: new Date().toISOString(),
      data: {
        threads,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getThreadByIdController = (request, response, next) => {
  try {
    const { threadId } = request.params;
    const thread = threadsService.getThreadById(threadId);

    logger.info(`get thread by id ${threadId} successfully`);
    response.status(200).json({
      status: "success",
      message: "get thread by id successfully",
      timestamp: new Date().toISOString(),
      data: {
        thread,
      },
    });
  } catch (error) {
    next(error);
  }
};

const putThreadByIdController = (request, response, next) => {
  try {
    ThreadsValidator.validateThreadPayload(request.body);

    const { threadId } = request.params;
    const { content } = request.body;
    const { credentialId: owner } = request;

    threadsService.getThreadById(threadId);
    threadsService.verifyThreadOwner(threadId, owner);
    const thread = threadsService.editThreadById(threadId, content);

    logger.info(`thread updated with id ${threadId} by ${owner}`);
    response.status(200).json({
      status: "success",
      message: "thread updated successfully",
      timestamp: new Date().toISOString(),
      data: {
        thread,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteThreadByIdController = (request, response, next) => {
  try {
    const { threadId } = request.params;
    const { credentialId: owner } = request;

    threadsService.getThreadById(threadId);
    threadsService.verifyThreadOwner(threadId, owner);
    threadsService.deleteThreadById(threadId);

    logger.info(`thread deleted with id ${threadId} by ${owner}`);
    response.status(200).json({
      status: "success",
      message: "thread deleted successfully",
      timestamp: new Date().toISOString(),
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  postThreadController,
  getThreadsController,
  getThreadByIdController,
  putThreadByIdController,
  deleteThreadByIdController,
};
