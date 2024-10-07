import { nanoid } from "nanoid";
// exceptions
import AuthorizationError from "../exceptions/AuthorizationError.js";
import InvariantError from "../exceptions/InvariantError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
// utils
import { mapDBToModel } from "../utils/index.js";

class ThreadsService {
  constructor(pool) {
    this._pool = pool;
  }

  async addthread(content, owner) {
    const id = `thread-${nanoid(15)}`;

    const query = {
      text: "INSERT INTO threads VALUES ($1, $2, $3) RETURNING id, content, owner, created_at, updated_at",
      values: [id, content, owner],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new InvariantError("thread added failed");
    }

    return rows.map(mapDBToModel)[0];
  }

  async getAllThreads() {
    const { rows } = await this._pool.query(
      "SELECT id, content, owner, created_at, updated_at FROM threads",
    );
    return rows.map(mapDBToModel);
  }

  async getThreadById(id) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [id],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError("cannot find thread");
    }

    return rows.map(mapDBToModel)[0];
  }

  async editThreadById(id, content) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: "UPDATE threads SET content = $2, updated_at = $3 WHERE id = $1 RETURNING id, content, owner, created_at, updated_at",
      values: [id, content, updatedAt],
    };

    const { rows } = await this._pool.query(query);

    return rows.map(mapDBToModel)[0];
  }

  async deleteThreadById(id) {
    const query = {
      text: "DELETE FROM threads WHERE id = $1",
      values: [id],
    };

    await this._pool.query(query);
  }

  async verifyThreadOwner(threadOwner, owner) {
    if (threadOwner !== owner) {
      throw new AuthorizationError(
        "you are not entitled to access this resource",
      );
    }
  }
}

export default ThreadsService;
