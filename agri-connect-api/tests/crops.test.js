const request = require("supertest");
const app = require("../server"); // import the Express app
const Crops = require("../models/cropsModel");

describe("Crops API", () => {
  let testCrop;

  // Clean up after all tests
  afterAll(async () => {
    if (testCrop) {
      await Crops.destroy({ where: { id: testCrop.id } });
    }
  });

  test("POST /api/v1/crops creates a crop", async () => {
    const name = "TestCrop_" + Date.now();
    const res = await request(app)
      .post("/api/v1/crops")
      .send({ name });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe(name);

    // Save for later tests
    testCrop = res.body.data;
  });

  test("GET /api/v1/crops returns all crops", async () => {
    const res = await request(app).get("/api/v1/crops");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);

    // Optional: ensure testCrop is in the list
    const cropExists = res.body.data.some(c => c.id === testCrop.id);
    expect(cropExists).toBe(true);
  });

  test("PUT /api/v1/crops/:id updates a crop", async () => {
    const updatedName = "UpdatedCrop_" + Date.now();
    const res = await request(app)
      .put(`/api/v1/crops/${testCrop.id}`)
      .send({ name: updatedName });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.crop.name).toBe(updatedName);

    // Update local variable for further tests
    testCrop.name = updatedName;
  });

  test("DELETE /api/v1/crops/:id deletes a crop", async () => {
    const res = await request(app).delete(`/api/v1/crops/${testCrop.id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Ensure crop is actually deleted
    const deletedCrop = await Crops.findByPk(testCrop.id);
    expect(deletedCrop).toBeNull();

    // Reset testCrop
    testCrop = null;
  });
});
