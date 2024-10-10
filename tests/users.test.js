import supertest from "supertest";
import { web } from "../src/application/web.js";
import {
  createTestUser,
  getTestUserById,
  removeAllTestUsers,
} from "./test-utils.js";

describe("POST /users", () => {
  afterEach(async () => {
    await removeAllTestUsers();
  });

  it("should response 201 and create new user", async () => {
    const result = await supertest(web).post("/users").send({
      username: "johndoe",
      password: "secretpassword",
      fullname: "John Doe",
    });

    expect(result.status).toBe(201);
    expect(result.body.status).toBe("success");
    expect(result.body.message).toBeDefined();
    expect(result.body.timestamp).toBeDefined();

    expect(result.body.data.user).toBeDefined();
    expect(result.body.data.user.id).toBeDefined();
    expect(result.body.data.user.username).toBe("johndoe");
    expect(result.body.data.user.fullname).toBe("John Doe");
  });

  it("should response 400 and reject if request is invalid", async () => {
    const result = await supertest(web).post("/users").send({
      username: "",
      password: "",
      fullname: "",
    });

    expect(result.status).toBe(400);
    expect(result.body.status).toBe("fail");
    expect(result.body.message).toBeDefined();
    expect(result.body.timestamp).toBeDefined();
    expect(result.body.path).toBe("/users");
  });

  it("should response 400 and reject if username already registered", async () => {
    let result = await supertest(web).post("/users").send({
      username: "johndoe",
      password: "secretpassword",
      fullname: "John Doe",
    });

    expect(result.status).toBe(201);
    expect(result.body.status).toBe("success");
    expect(result.body.message).toBeDefined();
    expect(result.body.timestamp).toBeDefined();

    expect(result.body.data.user).toBeDefined();
    expect(result.body.data.user.id).toBeDefined();
    expect(result.body.data.user.username).toBe("johndoe");
    expect(result.body.data.user.fullname).toBe("John Doe");

    result = await supertest(web).post("/users").send({
      username: "johndoe",
      password: "secretpassword",
      fullname: "John Doe",
    });

    expect(result.status).toBe(400);
    expect(result.body.status).toBe("fail");
    expect(result.body.message).toBeDefined();
    expect(result.body.timestamp).toBeDefined();
    expect(result.body.path).toBe("/users");
  });
});

describe("GET /users/:userId", () => {
  beforeAll(async () => {
    await createTestUser();
  });

  afterAll(async () => {
    await removeAllTestUsers();
  });

  it("should response 200 and get user", async () => {
    const testUser = await getTestUserById();

    const result = await supertest(web).get(`/users/${testUser.id}`);

    expect(result.status).toBe(200);
    expect(result.body.status).toBe("success");
    expect(result.body.message).toBeDefined();
    expect(result.body.timestamp).toBeDefined();

    expect(result.body.data.user).toBeDefined();
    expect(result.body.data.user.id).toBe("user-123");
    expect(result.body.data.user.username).toBe("johndoe");
    expect(result.body.data.user.fullname).toBe("John Doe");
  });

  it("should response 404 and cannot get user", async () => {
    const result = await supertest(web).get("/users/not-found");

    expect(result.status).toBe(404);
    expect(result.body.status).toBe("fail");
    expect(result.body.message).toBeDefined();
    expect(result.body.timestamp).toBeDefined();
    expect(result.body.path).toBe("/users/not-found");
  });
});
