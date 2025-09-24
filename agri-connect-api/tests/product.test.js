// tests/product.test.js

const request = require("supertest");
const app = require("../server"); // Your Express app
const Product = require("../models/productModel");

const userId = 1;
let createdProductId;

describe("Product API - CRUD Tests", () => {

  // Create Product
  test("POST /api/v1/product - create a new product", async () => {
    const newProduct = {
      name: "Test Product",
      qty: 10,
      description: "Test Description",
      price: 100,
      availability: 0,
      productType: 1,
      userId,
      image: "test_image.png" // simplified image name
    };

    const res = await request(app)
      .post("/api/v1/product")
      .send(newProduct);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/created successfully/i);
    expect(res.body.data).toHaveProperty("id");

    createdProductId = res.body.data.id;
  });

  // Get all products
  test("GET /api/v1/product - fetch all products", async () => {
    const res = await request(app).get("/api/v1/product");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // Get product by ID
  test("GET /api/v1/product/:id - fetch product by ID", async () => {
    const res = await request(app).get(`/api/v1/product/${createdProductId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id", createdProductId);
  });

  // Update product
  test("PUT /api/v1/product/:id - update product", async () => {
    const updatedData = {
      name: "Updated Product",
      qty: 20,
      price: 150
    };

    const res = await request(app)
      .put(`/api/v1/product/${createdProductId}`)
      .send(updatedData);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/updated successfully/i);
    expect(res.body.data.name).toBe(updatedData.name);
  });

  // Delete product
  test("DELETE /api/v1/product/:id - delete product", async () => {
    const res = await request(app).delete(`/api/v1/product/${createdProductId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });

});
