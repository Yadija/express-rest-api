class ThreadsController {
  constructor(service, validator, logger) {
    this._service = service;
    this._validator = validator;
    this._logger = logger;
  }

  async postThreadController(request, response, next) {
    try {
      const payload = this._validator.validateThreadPayload(request.body);
      const { content } = payload;
      const { credentialId: owner } = request;

      const thread = await this._service.addThread(content, owner);

      this._logger.info(`thread created with id ${thread.id} by ${owner}`);
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
  }

  async getThreadsController(request, response, next) {
    try {
      const threads = await this._service.getAllThreads();

      this._logger.info("get threads successfully");
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
  }

  async getThreadByIdController(request, response, next) {
    try {
      const { threadId } = request.params;
      const thread = await this._service.getThreadById(threadId);

      this._logger.info(`get thread by id ${threadId} successfully`);
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
  }

  async putThreadByIdController(request, response, next) {
    try {
      const payload = this._validator.validateThreadPayload(request.body);
      const { threadId } = request.params;
      const { content } = payload;
      const { credentialId: owner } = request;

      const { owner: threadOwner } =
        await this._service.getThreadById(threadId);
      await this._service.verifyThreadOwner(threadOwner, owner);
      const thread = await this._service.editThreadById(threadId, content);

      this._logger.info(`thread updated with id ${threadId} by ${owner}`);
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
  }

  async deleteThreadByIdController(request, response, next) {
    try {
      const { threadId } = request.params;
      const { credentialId: owner } = request;

      const { owner: threadOwner } =
        await this._service.getThreadById(threadId);
      await this._service.verifyThreadOwner(threadOwner, owner);
      await this._service.deleteThreadById(threadId);

      this._logger.info(`thread deleted with id ${threadId} by ${owner}`);
      response.status(200).json({
        status: "success",
        message: "thread deleted successfully",
        timestamp: new Date().toISOString(),
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default ThreadsController;
