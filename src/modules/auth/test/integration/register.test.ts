import request from "supertest";
import sequelize from "../../../../config/database";
import app from "../../../../app";

beforeAll(async () => {
  await sequelize.sync({ force: true }); // fresh test db
});

afterAll(async () => {
  await sequelize.close();
});

describe("POST /api/v1/auth/register", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "Password123",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.email).toBe("test@example.com");
  });

it("should not allow duplicate email", async () => {
  await request(app)
    .post("/api/v1/auth/register")
    .send({ name: "Test", email: "test@example.com", password: "password123" });

  const res = await request(app)
    .post("/api/v1/auth/register")
    .send({ name: "Test", email: "test@example.com", password: "password123" });

  expect(res.statusCode).toBe(500);
  expect(res.body.message).toMatch(/already exists/i);
});

});
