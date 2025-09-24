const request = require("supertest");
const app = require("../server");

describe("Authentication - Sign In", () => {
  const existingUser = {
    email: "john.doe@example.com",
    password: "Password123",
  };

  it("should return a JWT token on successful sign-in", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signin")
      .send(existingUser);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.user.email).toBe(existingUser.email);
    expect(res.body).toHaveProperty("message", "Sign in successful!");
  });
});
