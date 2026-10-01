const productService = require("../service/product.service");
const asyncHandler = require("../middleware/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

const createProduct = asyncHandler(async (req, res) => {
  const data = { ...req.body, image: req.file ? req.file.path : null };
  const newProduct = await productService.createProduct(data);
  return successResponse(res, 201, "Product created successfully", newProduct);
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const newImage = req.file ? req.file.path : null;
  const product = await productService.updateProduct(id, req.body, newImage);
  return successResponse(res, 200, "Product updated successfully", product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await productService.deleteProduct(id);
  return successResponse(res, 200, "Product deleted successfully");
});

const getAllProduct = asyncHandler(async (req, res) => {
  const products = await productService.getAllProduct();
  return successResponse(res, 200, "Products retrieved successfully", products);
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await productService.getProductById(id);
  return successResponse(res, 200, "Product retrieved successfully", product);
});

const getProduct = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const products = await productService.getProduct(userId);
  return successResponse(res, 200, "Products retrieved successfully", products);
});

module.exports = { createProduct, updateProduct, deleteProduct, getAllProduct, getProductById, getProduct };
