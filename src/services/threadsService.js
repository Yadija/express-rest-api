import { nanoid } from "nanoid";
// exceptions
import AuthorizationError from "../exceptions/AuthorizationError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
// utils
import threads from "../utils/threads.js";

const addThread = (content, owner) => {
  const id = `thread-${nanoid(15)}`;

  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const thread = {
    id,
    content,
    owner,
    createdAt,
    updatedAt,
  };
  threads.push(thread);

  return thread;
};

const getAllThreads = () => threads;

const getThreadById = (id) => {
  const thread = threads.find((thread) => thread.id === id);

  if (!thread) {
    throw new NotFoundError("cannot find thread");
  }

  return thread;
};

const editThreadById = (id, content) => {
  const index = threads.findIndex((thread) => thread.id === id);
  const updatedAt = new Date().toISOString();

  threads[index] = {
    ...threads[index],
    content,
    updatedAt,
  };

  return threads[index];
};

const verifyThreadOwner = (id, owner) => {
  const thread = threads.find((thread) => thread.id === id);
  if (thread.owner !== owner) {
    throw new AuthorizationError(
      "you are not entitled to access this resource",
    );
  }
};

const deleteThreadById = (id) => {
  const index = threads.findIndex((thread) => thread.id === id);
  threads.splice(index, 1);
};

export default {
  addThread,
  getAllThreads,
  getThreadById,
  editThreadById,
  deleteThreadById,
  verifyThreadOwner,
};
