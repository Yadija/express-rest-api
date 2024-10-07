import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
// exceptions
import InvariantError from "../exceptions/InvariantError.js";
import NotFoundError from "../exceptions/NotFoundError.js";

class UsersService {
  constructor(pool) {
    this._pool = pool;
  }

  async addUser({ username, password, fullname }) {
    const id = `user-${nanoid(15)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: "INSERT INTO users VALUES ($1, $2, $3, $4) RETURNING id, username, fullname",
      values: [id, username, hashedPassword, fullname],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new InvariantError("user added failed");
    }

    return rows[0];
  }

  async verifyNewUsername(username) {
    const query = {
      text: "SELECT username FROM users WHERE username = $1",
      values: [username],
    };

    const { rowCount } = await this._pool.query(query);

    if (rowCount > 0) {
      throw new InvariantError("username already exists");
    }
  }

  async getUserById(userId) {
    const query = {
      text: "SELECT id, username, fullname FROM users WHERE id = $1",
      values: [userId],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError("cannot find user");
    }

    return rows[0];
  }
}

export default UsersService;
