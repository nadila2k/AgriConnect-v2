// tests/blog.test.js

const request = require("supertest");
const app = require("../server"); // Your Express app

let createdBlogId;

describe("Blog API - CRUD Tests", () => {

  // Create Blog
  test("POST /api/v1/blogs - create a new blog", async () => {
    const newBlog = {
      title: "Test Blog",
      description: "This is a test blog",
      image: "test_image.png" // simple name
    };

    const res = await request(app)
      .post("/api/v1/blogs")
      .send(newBlog);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/created successfully/i);
    expect(res.body.data).toHaveProperty("id");

    createdBlogId = res.body.data.id;
  });

  // Get all blogs
  test("GET /api/v1/blogs - fetch all blogs", async () => {
    const res = await request(app).get("/api/v1/blogs");

    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  // Update blog
  test("PUT /api/v1/blogs/:id - update blog", async () => {
    const updatedData = {
      title: "Updated Blog",
      description: "Updated description",
      image: "updated_image.png"
    };

    const res = await request(app)
      .put(`/api/v1/blogs/${createdBlogId}`)
      .send(updatedData);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(updatedData.title);
  });

  // Delete blog
  test("DELETE /api/v1/blogs/:id - delete blog", async () => {
    const res = await request(app).delete(`/api/v1/blogs/${createdBlogId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });

});
