// tests/farmerStatistic.test.js

const request = require("supertest");
const app = require("../server"); // Your Express app
const FarmerStatistic = require("../models/farmerStatisticModel");

const monthId = 1;
const progressId = 1;
const userId = 1;
const cropsStatisticId = 1;
let createdId;

describe("FarmerStatistic API - CRUD Tests", () => {

  // Create Farmer Statistic
  test("POST /api/v1/farmerStatistic - create a new farmer statistic", async () => {
    const newData = {
      perch: 50,
      monthId,
      progressId,
      userId,
      cropsStatisticId,
    };

    const res = await request(app)
      .post("/api/v1/farmerStatistic")
      .send(newData);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/created successfully/i);
    expect(res.body.data).toHaveProperty("id");

    createdId = res.body.data.id;
  });

  // Get all Farmer Statistics
  test("GET /api/v1/farmerStatistic - fetch all farmer statistics", async () => {
    const res = await request(app).get("/api/v1/farmerStatistic");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // Get Farmer Statistic by ID
  test("GET /api/v1/farmerStatistic/:id - fetch farmer statistic by ID", async () => {
    const res = await request(app).get(`/api/v1/farmerStatistic/${userId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // Update Farmer Statistic
  test("PUT /api/v1/farmerStatistic/:id - update farmer statistic progress", async () => {
    const updatedData = {
      progressId: progressId, // Keep the same or change to test update
    };

    const res = await request(app)
      .put(`/api/v1/farmerStatistic/${createdId}`)
      .send(updatedData);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/progress updated successfully/i);
  });

});
