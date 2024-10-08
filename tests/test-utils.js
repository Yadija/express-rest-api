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
