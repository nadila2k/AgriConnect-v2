const request = require("supertest");
const app = require("../server"); // your Express app
const CropsStatistic = require("../models/cropsStatisticModel");

const cropId = 1;
const yearId = 1;
let createdId;

describe("CropsStatistic API - CRUD Tests", () => {
  test("POST /api/v1/cropsStatistic - create a new crop statistic", async () => {
    const newData = {
      weight: 100,
      production: 200,
      cropsId: cropId,
      yearId: yearId,
    };

    const res = await request(app)
      .post("/api/v1/cropsStatistic")
      .send(newData);

    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/created successfully/i);
    expect(res.body.data).toHaveProperty("id");

    createdId = res.body.data.id;
  });

  test("GET /api/v1/cropsStatistic - fetch all crop statistics", async () => {
    const res = await request(app).get("/api/v1/cropsStatistic");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("GET /api/v1/cropsStatistic/:id - fetch a crop statistic by ID", async () => {
    const res = await request(app).get(`/api/v1/cropsStatistic/${createdId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", createdId);
  });

  test("PUT /api/v1/cropsStatistic/:id - update a crop statistic", async () => {
    const updatedData = {
      weight: 150,
      production: 250,
      cropsId: cropId,
      yearId: yearId,
    };

    const res = await request(app)
      .put(`/api/v1/cropsStatistic/${createdId}`)
      .send(updatedData);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/updated successfully/i);
  });
});
