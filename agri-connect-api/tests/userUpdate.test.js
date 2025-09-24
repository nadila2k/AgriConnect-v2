const request = require("supertest");
const app = require("../server");
const User = require("../models/userModel");

describe("User Controller - Update User", () => {
  let testUser;

  beforeAll(async () => {
    try {
     

      // Create a test user with unique email
      testUser = await User.create({
        firstName: "Jane",
        lastName: "Smith",
        email: `jane.smith.${Date.now()}@example.com`, // unique email
        password: "password123",
        district: "District 2",
        phoneNumber: "9876543210", // ensure this matches your model type
        role: 1,
      });

      if (!testUser) throw new Error("Test user was not created!");
      console.log("Test user created with ID:", testUser.id);
    } catch (err) {
      console.error("Error in beforeAll creating test user:", err);
      throw err; // stop tests if creation fails
    }
  });

  afterAll(async () => {
    try {
      if (testUser && testUser.id) {
        await User.destroy({ where: { id: testUser.id } });
        console.log("Test user cleaned up.");
      }
    } catch (err) {
      console.error("Error cleaning up test user:", err);
    }
  });

  it("should return 400 when updating user with invalid data", async () => {
    expect(testUser).toBeDefined(); // sanity check

    const res = await request(app)
      .put(`/api/v1/users/${testUser.id}`)
      .send({
        firstName: "",
        lastName: "",
        email: "",
        district: "",
        phoneNumber: ""
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("All fields are required.");
  });
});
