const request = require("supertest");
const app = require("../server");
const User = require("../models/userModel");

describe("Authentication - Sign In Negative", () => {
  let testUser;

  beforeAll(async () => {
    testUser = await User.findOne({ where: { email: "jane@example.com" } });
    if (!testUser) {
      testUser = await User.create({
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        password: "password123",
        district: "District 2",
        phoneNumber: 987654321, // safe INTEGER
        role: 1,
      });
    }
  });

  it("should return 401 for incorrect password", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signin")
      .send({ email: testUser.email, password: "wrongpassword" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Incorrect password.");
  });

  it("should return 404 for non-existent email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signin")
      .send({ email: "notexist@example.com", password: "password123" });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found.");
  });
});
