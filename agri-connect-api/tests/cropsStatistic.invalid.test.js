const request = require("supertest");
const app = require("../server");

describe("CropsStatistic API - Negative Test", () => {
  test("POST /api/v1/cropsStatistic with invalid data should return 500", async () => {
    const invalidData = {
      weight: "not-a-number",  // ❌ should be a number
      production: null,        // ❌ should be a number
      cropsId: "abc",          // ❌ should be integer
      yearId: 9999             // ❌ non-existent year
    };

    const res = await request(app)
      .post("/api/v1/cropsStatistic")
      .send(invalidData);

    // Adjust expectations to match controller
    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/failed to create/i);
  });
});
