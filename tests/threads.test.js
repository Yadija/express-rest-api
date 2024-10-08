import supertest from "supertest";
import { web } from "../src/application/web.js";
import {
  createAnotherTestUser,
  createManyTestThreads,
  createAnotherManyTestThreads,
  createTestThread,
  createTestUser,
  getTestThread,
  removeAllTestAuthentication,
  removeAllTestThreads,
  removeAllTestUsers,
} from "./test-utils.js";

describe("POST /threads", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAllTestThreads();
    await removeAllTestAuthentication();
    await removeAllTestUsers();
  });

  it("should response 201 and create new thread", async () => {
    const {
      body: {
        data: { accessToken },
      },
    } = await supertest(web).post("/auth/login").send({
      username: "johndoe",
      password: "secretpassword",
    });

    const result = await supertest(web)
      .post("/threads")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "Hello World",
      });

    expect(result.status).toBe(201);
    expect(result.body.status).toBe("success");
    expect(result.body.message).toBeDefined();
    expect(result.body.timestamp).toBeDefined();

    expect(result.body.data.thread).toBeDefined();
    expect(result.body.data.thread.id).toBeDefined();
    expect(result.body.data.thread.content).toBe("Hello World");
    expect(result.body.data.thread.owner).toBe("user-123");
    expect(result.body.data.thread.createdAt).toBeDefined();
    expect(result.body.data.thread.updatedAt).toBeDefined();
  });

  it("should response 400 and reject if request content is invalid", async () => {
    const {
      body: {
        data: { accessToken },
      },
    } = await supertest(web).post("/auth/login").send({
      username: "johndoe",
      password: "secretpassword",
    });

    const result = await supertest(web)
      .post("/threads")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "",
      });

    expect(result.status).toBe(400);
    expect(result.body.status).toBe("fail");
    expect(result.body.message).toBeDefined();
    expect(result.body.timestamp).toBeDefined();
    expect(result.body.path).toBe("/threads");
  });

  it("should response 401 and reject if no authentication", async () => {
    const result = await supertest(web).post("/threads").send({
      content: "Hello World",
    });

    expect(result.status).toBe(401);
    expect(result.body.status).toBe("fail");
    expect(result.body.message).toBeDefined();
    expect(result.body.timestamp).toBeDefined();
    expect(result.body.path).toBe("/threads");
  });
});

describe("GET /threads", () => {
  beforeEach(async () => {
    await createTestUser();
    await createAnotherTestUser();
    await createManyTestThreads();
    await createAnotherManyTestThreads();
  });

  afterEach(async () => {
    await removeAllTestThreads();
    await removeAllTestAuthentication();
    await removeAllTestUsers();
  });

  it("should response 200 and get all threads", async () => {
    const result = await supertest(web).get("/threads");

    expect(result.status).toBe(200);
    expect(result.body.status).toBe("success");
    expect(result.body.message).toBeDefined();
    expect(result.body.timestamp).toBeDefined();

    expect(result.body.data).toBeDefined();
    expect(result.body.data.threads).toBeDefined();
    expect(result.body.data.threads.length).toBe(10);

    for (let i = 0; i < result.body.data.threads.length; i++) {
      expect(result.body.data.threads[i].id).toBeDefined();
      expect(result.body.data.threads[i].content).toBeDefined();
      expect(result.body.data.threads[i].owner).toBeDefined();
      expect(result.body.data.threads[i].createdAt).toBeDefined();
      expect(result.body.data.threads[i].updatedAt).toBeDefined();
    }
  });
});

describe("GET /threads/:threadId", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestThread();
  });

  afterEach(async () => {
    await removeAllTestThreads();
    await removeAllTestAuthentication();
    await removeAllTestUsers();
  });

  it("should response 200 and get thread by id", async () => {
    const testThread = await getTestThread();

    const result = await supertest(web).get(`/threads/${testThread.id}`);

    expect(result.status).toBe(200);
    expect(result.body.status).toBe("success");
    expect(result.body.message).toBeDefined();
    expect(result.body.timestamp).toBeDefined();

    expect(result.body.data.thread.id).toBeDefined();
    expect(result.body.data.thread.content).toBe("Hello World");
    expect(result.body.data.thread.owner).toBe("user-123");
    expect(result.body.data.thread.createdAt).toBeDefined();
    expect(result.body.data.thread.updatedAt).toBeDefined();
  });

  it("should response 404 and cannot get thread", async () => {
    const result = await supertest(web).get("/threads/not_found_thread_id");

    expect(result.status).toBe(404);
    expect(result.body.status).toBe("fail");
    expect(result.body.message).toBeDefined();
    expect(result.body.timestamp).toBeDefined();
    expect(result.body.path).toBe("/threads/not_found_thread_id");
  });
});

describe("PUT /threads/:threadId", () => {
  beforeEach(async () => {
    await createTestUser();
    await createAnotherTestUser();
    await createTestThread();
  });

  afterEach(async () => {
    await removeAllTestThreads();
    await removeAllTestAuthentication();
    await removeAllTestUsers();
  });

  it("should response 200 and can update thread", async () => {
    const {
      body: {
        data: { accessToken },
      },
    } = await supertest(web).post("/auth/login").send({
      username: "johndoe",
      password: "secretpassword",
    });

    // make thread
    const {
      body: {
        data: { thread },
      },
    } = await supertest(web)
      .post("/threads")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "Hello World",
      });

    // update thread
    const result = await supertest(web)
      .put(`/threads/${thread.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "Hello World update",
      });

    expect(result.status).toBe(200);
    expect(result.body.status).toBe("success");
    expect(result.body.message).toBeDefined();
    expect(result.body.timestamp).toBeDefined();

    expect(result.body.data.thread.id).toBeDefined();
    expect(result.body.data.thread.content).toBe("Hello World update");
    expect(result.body.data.thread.owner).toBe("user-123");
    expect(result.body.data.thread.createdAt).toBeDefined();
    expect(result.body.data.thread.updatedAt).not.toBe(
      result.body.data.thread.createdAt,
    );
  });

  it("should response 400 and reject if request content is invalid", async () => {
    const {
      body: {
        data: { accessToken },
      },
    } = await supertest(web).post("/auth/login").send({
      username: "johndoe",
      password: "secretpassword",
    });

    // make thread
    const {
      body: {
        data: { thread },
      },
    } = await supertest(web)
      .post("/threads")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "Hello World",
      });

    // update thread
    const result = await supertest(web)
      .put(`/threads/${thread.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "",
      });

    expect(result.status).toBe(400);
    expect(result.body.status).toBe("fail");
    expect(result.body.message).toBeDefined();
    expect(result.body.timestamp).toBeDefined();
    expect(result.body.path).toBe(`/threads/${thread.id}`);
  });

  it("should response 401 and reject if no authentication", async () => {
    const testThread = await getTestThread();
    const result = await supertest(web).put(`/threads/${testThread.id}`).send({
      content: "update test",
    });

    expect(result.status).toBe(401);
    expect(result.body.status).toBe("fail");
    expect(result.body.message).toBeDefined();
    expect(result.body.timestamp).toBeDefined();
    expect(result.body.path).toBe(`/threads/${testThread.id}`);
  });

  it("should response 403 and reject if no authorization", async () => {
    const testThread = await getTestThread();

    const {
      body: {
        data: { accessToken },
      },
    } = await supertest(web).post("/auth/login").send({
      username: "janedoe",
      password: "secretpassword",
    });

    const result = await supertest(web)
      .put(`/threads/${testThread.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "update test",
      });

    expect(result.status).toBe(403);
    expect(result.body.status).toBe("fail");
    expect(result.body.message).toBeDefined();
  });

  it("should response 404 and reject if thread id is invalid", async () => {
    const {
      body: {
        data: { accessToken },
      },
    } = await supertest(web).post("/auth/login").send({
      username: "johndoe",
      password: "secretpassword",
    });

    const result = await supertest(web)
      .put("/threads/not_found_thread_id")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "update test",
      });

    expect(result.status).toBe(404);
    expect(result.body.status).toBe("fail");
    expect(result.body.message).toBeDefined();
    expect(result.body.timestamp).toBeDefined();
    expect(result.body.path).toBe("/threads/not_found_thread_id");
  });
});

describe("DELETE /threads/:threadId", () => {
  beforeEach(async () => {
    await createTestUser();
    await createAnotherTestUser();
    await createTestThread();
  });

  afterEach(async () => {
    await removeAllTestThreads();
    await removeAllTestAuthentication();
    await removeAllTestUsers();
  });

  it("should response 200 and can delete thread", async () => {
    const {
      body: {
        data: { accessToken },
      },
    } = await supertest(web).post("/auth/login").send({
      username: "johndoe",
      password: "secretpassword",
    });

    // make thread
    const {
      body: {
        data: { thread },
      },
    } = await supertest(web)
      .post("/threads")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "Hello World",
      });

    // delete thread
    const result = await supertest(web)
      .delete(`/threads/${thread.id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(result.status).toBe(200);
    expect(result.body.status).toBe("success");
    expect(result.body.message).toBeDefined();
    expect(result.body.timestamp).toBeDefined();
    expect(result.body.data).toBeNull();

    // check thread deleted
    const checkThread = await supertest(web).get(`/threads/${thread.id}`);
    expect(checkThread.status).toBe(404);
    expect(checkThread.body.status).toBe("fail");
    expect(checkThread.body.message).toBeDefined();
    expect(checkThread.body.timestamp).toBeDefined();
    expect(checkThread.body.path).toBe(`/threads/${thread.id}`);
  });

  it("should response 401 and reject if no authentication", async () => {
    const testThread = await getTestThread();
    const result = await supertest(web).delete(`/threads/${testThread.id}`);

    expect(result.status).toBe(401);
    expect(result.body.status).toBe("fail");
    expect(result.body.message).toBeDefined();
    expect(result.body.timestamp).toBeDefined();
    expect(result.body.path).toBe(`/threads/${testThread.id}`);
  });

  it("should response 403 and reject if no authorization", async () => {
    const testThread = await getTestThread();

    const {
      body: {
        data: { accessToken },
      },
    } = await supertest(web).post("/auth/login").send({
      username: "janedoe",
      password: "secretpassword",
    });

    const result = await supertest(web)
      .delete(`/threads/${testThread.id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(result.status).toBe(403);
    expect(result.body.status).toBe("fail");
    expect(result.body.message).toBeDefined();
    expect(result.body.timestamp).toBeDefined();
    expect(result.body.path).toBe(`/threads/${testThread.id}`);
  });

  it("should response 404 and reject if thread id is invalid", async () => {
    const {
      body: {
        data: { accessToken },
      },
    } = await supertest(web).post("/auth/login").send({
      username: "johndoe",
      password: "secretpassword",
    });

    const result = await supertest(web)
      .delete("/threads/not_found_thread_id")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(result.status).toBe(404);
    expect(result.body.status).toBe("fail");
    expect(result.body.message).toBeDefined();
    expect(result.body.timestamp).toBeDefined();
    expect(result.body.path).toBe("/threads/not_found_thread_id");
  });
});
