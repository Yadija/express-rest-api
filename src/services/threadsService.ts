// application
import { prismaClient } from "../application/database";
// exceptions
import AuthorizationError from "../exceptions/AuthorizationError";
import InvariantError from "../exceptions/InvariantError";
import NotFoundError from "../exceptions/NotFoundError";

class ThreadsService {
  async addThread(content: string, owner: string) {
    try {
      const thread = await prismaClient.thread.create({
        data: {
          content,
          owner,
        },
        select: {
          id: true,
          content: true,
          owner: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return thread;
    } catch {
      throw new InvariantError("thread addition failed");
    }
  }

  async getAllThreads() {
    const threads = await prismaClient.thread.findMany();
    return threads;
  }

  async getThreadById(id: string) {
    const thread = await prismaClient.thread.findUnique({
      where: { id },
    });

    if (!thread) {
      throw new NotFoundError("cannot find thread");
    }

    return thread;
  }

  async editThreadById(id: string, content: string) {
    const thread = await prismaClient.thread.update({
      where: { id },
      data: {
        content,
      },
    });

    return thread;
  }

  async deleteThreadById(id: string) {
    await prismaClient.thread.delete({
      where: { id },
    });
  }

  async verifyThreadOwner(threadOwner: string, owner: string) {
    if (threadOwner !== owner) {
      throw new AuthorizationError(
        "you are not entitled to access this resource",
      );
    }
  }
}

export default ThreadsService;
