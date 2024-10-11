import supertest from "supertest";
import { web } from "../src/application/web.js";
import {
  createTestUser,
  removeAllTestAuthentication,
  removeAllTestUsers,
} from "./test-utils.js";

describe("POST /auth/login", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAllTestAuthentication();
    await removeAllTestUsers();
  });

  it("should response 200 and create new tokens", async () => {
    const result = await supertest(web).post("/auth/login").send({
      username: "johndoe",
      password: "secretpassword",
    });

    expect(result.status).toBe(200);
    expect(result.body.status).toBe("success");
    expect(result.body.message).toBeDefined();
    expect(result.body.timestamp).toBeDefined();

    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.username).toBe("johndoe");
    expect(result.body.data.fullname).toBeDefined();
    expect(result.body.data.accessToken).toBeDefined();
    expect(result.body.data.accessToken).not.toBe("");
    expect(result.body.data.refreshToken).toBeDefined();
    expect(result.body.data.refreshToken).not.toBe("");
  });

  it("should response 401 and reject if username is wrong", async () => {
    const result = await supertest(web).post("/auth/login").send({
      username: "wrong",
      password: "wrong",
    });

    expect(result.status).toBe(401);
    expect(result.body.status).toBe("fail");
    expect(result.body.message).toBeDefined();
    expect(result.body.timestamp).toBeDefined();
    expect(result.body.path).toBe("/auth/login");
  });

  it("should response 401 and reject if password is wrong", async () => {
    const result = await supertest(web).post("/auth/login").send({
      username: "test",
      password: "wrong",
    });

    expect(result.status).toBe(401);
    expect(result.body.status).toBe("fail");
    expect(result.body.message).toBeDefined();
    expect(result.body.timestamp).toBeDefined();
    expect(result.body.path).toBe("/auth/login");
  });
});

describe("PUT /auth/refresh", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAllTestAuthentication();
    await removeAllTestUsers();
  });

  it("should response 200 and create new tokens", async () => {
    const {
      body: {
        data: { refreshToken },
      },
    } = await supertest(web).post("/auth/login").send({
      username: "johndoe",
      password: "secretpassword",
    });

    const result = await supertest(web).put("/auth/refresh").send({
      refreshToken,
    });

    expect(result.status).toBe(200);
    expect(result.body.status).toBe("success");
    expect(result.body.message).toBeDefined();
    expect(result.body.timestamp).toBeDefined();

    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.username).toBe("johndoe");
    expect(result.body.data.fullname).toBeDefined();
    expect(result.body.data.accessToken).toBeDefined();
    expect(result.body.data.accessToken).not.toBe("");
    expect(result.body.data.refreshToken).toBeDefined();
    expect(result.body.data.refreshToken).not.toBe("");
  });

  it("should response 400 and cannot update if refresh token is invalid", async () => {
    const result = await supertest(web).put("/auth/refresh").send({
      refreshToken: "invalid_refresh_token",
    });

    expect(result.status).toBe(400);
    expect(result.body.status).toBe("fail");
    expect(result.body.message).toBeDefined();
    expect(result.body.timestamp).toBeDefined();
    expect(result.body.path).toBe("/auth/refresh");
  });
});

describe("DELETE /auth/logout", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAllTestAuthentication();
    await removeAllTestUsers();
  });

  it("should response 200 and delete token", async () => {
    const {
      body: {
        data: { refreshToken },
      },
    } = await supertest(web).post("/auth/login").send({
      username: "johndoe",
      password: "secretpassword",
    });

    const result = await supertest(web).delete("/auth/logout").send({
      refreshToken,
    });

    expect(result.status).toBe(200);
    expect(result.body.status).toBe("success");
    expect(result.body.message).toBeDefined();
    expect(result.body.timestamp).toBeDefined();
    expect(result.body.data).toBeNull();
  });

  it("should response 400 and cannot delete if refresh token is invalid", async () => {
    const result = await supertest(web).delete("/auth/logout").send({
      refreshToken: "invalid_refresh_token",
    });

    expect(result.status).toBe(400);
    expect(result.body.status).toBe("fail");
    expect(result.body.message).toBeDefined();
    expect(result.body.timestamp).toBeDefined();
    expect(result.body.path).toBe("/auth/logout");
  });
});
