// tests/auth.test.js
const request = require("supertest");
const app = require("../server");
const { sequelize } = require("../database/dbConfig");
const User = require("../models/userModel");

describe("Authentication API", () => {
 

  describe("POST /api/v1/auth/signup", () => {
    it("should create a user with valid data", async () => {
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "Password123",
        district: "Central",
        phoneNumber: 1234567890,
        role: 1,
      };

      const res = await request(app)
        .post("/api/v1/auth/signup")
        .send(userData);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.message).toBe("User registered successfully!");
      expect(res.body.data.user).toHaveProperty("id");
      expect(res.body.data.user.email).toBe(userData.email);

      // Optional: Check user exists in DB
      const userInDb = await User.findOne({ where: { email: userData.email } });
      expect(userInDb).not.toBeNull();
      expect(userInDb.firstName).toBe(userData.firstName);
    });

    it("should return 400 if required fields are missing", async () => {
      const res = await request(app)
        .post("/api/v1/auth/signup")
        .send({ email: "missingfields@example.com" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Please fill in all required fields.");
    });

    it("should return 409 if email already exists", async () => {
      const duplicateUser = {
        firstName: "Jane",
        lastName: "Smith",
        email: "john.doe@example.com", // same as previous
        password: "Password123",
        district: "Central",
        phoneNumber: 9876543210,
        role: 2,
      };

      const res = await request(app)
        .post("/api/v1/auth/signup")
        .send(duplicateUser);

      expect(res.status).toBe(409);
      expect(res.body.message).toBe("Email already in use.");
    });
  });
});
