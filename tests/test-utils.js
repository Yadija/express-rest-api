import bcrypt from "bcrypt";
// application
import pool from "../src/application/database.js";

export const createTestUser = async () => {
  const user = {
    id: "user-123",
    username: "johndoe",
    fullname: "John Doe",
    password: bcrypt.hashSync("secretpassword", 10),
  };

  const query = {
    text: "INSERT INTO users VALUES ($1, $2, $3, $4)",
    values: [user.id, user.username, user.password, user.fullname],
  };

  await pool.query(query);
};

export const createAnotherTestUser = async () => {
  const user = {
    id: "user-456",
    username: "janedoe",
    fullname: "Jane Doe",
    password: bcrypt.hashSync("secretpassword", 10),
  };

  const query = {
    text: "INSERT INTO users VALUES ($1, $2, $3, $4)",
    values: [user.id, user.username, user.password, user.fullname],
  };

  await pool.query(query);
};

export const getTestUserById = async () => {
  const query = {
    text: "SELECT * FROM users WHERE id = $1",
    values: ["user-123"],
  };

  const { rows } = await pool.query(query);
  return rows[0];
};

export const removeAllTestUsers = async () => {
  const query = {
    text: "DELETE FROM users WHERE 1=1",
  };
  await pool.query(query);
};

export const removeAllTestAuthentication = async () => {
  const query = {
    text: "DELETE FROM authentications WHERE 1=1",
  };
  await pool.query(query);
};

export const createManyTestThreads = async () => {
  for (let i = 0; i < 5; i++) {
    const threadId = `thread-${i + 1}`;
    const content = `Hello World ${i + 1}`;
    const owner = "user-123";

    const query = {
      text: "INSERT INTO threads (id, content, owner) VALUES ($1, $2, $3)",
      values: [threadId, content, owner],
    };

    await pool.query(query);
  }
};

export const createAnotherManyTestThreads = async () => {
  for (let i = 0; i < 5; i++) {
    const threadId = `thread-${i + 6}`;
    const content = `Hello World ${i + 6}`;
    const owner = "user-456";

    const query = {
      text: "INSERT INTO threads (id, content, owner) VALUES ($1, $2, $3)",
      values: [threadId, content, owner],
    };

    await pool.query(query);
  }
};

export const createTestThread = async () => {
  const thread = {
    id: "thread-123",
    content: "Hello World",
    owner: "user-123",
  };

  const query = {
    text: "INSERT INTO threads (id, content, owner) VALUES ($1, $2, $3)",
    values: [thread.id, thread.content, thread.owner],
  };

  await pool.query(query);
};

export const getTestThread = async () => {
  const query = {
    text: "SELECT * FROM threads WHERE id = $1",
    values: ["thread-123"],
  };

  const { rows } = await pool.query(query);
  return rows[0];
};

export const removeAllTestThreads = async () => {
  const query = {
    text: "DELETE FROM threads WHERE 1=1",
  };
  await pool.query(query);
};
