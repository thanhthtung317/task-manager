const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task");
const {
  userOne,
  userOneId,
  taskOneId,
  userOneAuthToken,
  userTwoAuthToken,
  setupDatabase,
} = require("./fixtures/db");

beforeEach(setupDatabase);

test("should create task for user", async () => {
  const res = await request(app)
    .post("/tasks")
    .set("authorization", userOneAuthToken)
    .send({
      desc: "testing",
    })
    .expect(201);

  const task = await Task.findById(res.body._id);
  expect(task.desc).toBe("testing");
});

test("should return all tasks of user one", async () => {
  const res = await request(app)
    .get("/tasks")
    .set("authorization", userOneAuthToken)
    .send()
    .expect(200);

  expect(res.body.length).toBe(2);
});

test("should not delete other user task from database", async () => {
  await request(app)
    .delete(`/tasks/${taskOneId}`)
    .set("authorization", userTwoAuthToken)
    .send()
    .expect(404);

  const task = Task.findById(taskOneId);
  expect(task).not.toBeNull();
});
