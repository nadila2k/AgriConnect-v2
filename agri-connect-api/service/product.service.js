const Product = require('../models/productModel');
const User = require('../models/userModel');
const AppError = require("../utils/AppError");
const fs = require('fs');
const path = require('path');

const createProduct = async (data) => {
  return await Product.create(data);
};

const updateProduct = async (id, data, newImage) => {
  const product = await Product.findByPk(id);
  if (!product) throw new AppError("Product not found", 404);

  if (newImage && product.image) {
    const oldImagePath = path.join(__dirname, '..', product.image);
    fs.unlink(oldImagePath, () => {});
  }

  product.name = data.name || product.name;
  product.qty = data.qty || product.qty;
  product.description = data.description || product.description;
  product.price = data.price || product.price;
  product.availability = data.availability !== undefined ? data.availability : product.availability;
  product.productType = data.productType || product.productType;
  product.image = newImage || product.image;
  product.userId = data.userId || product.userId;

  await product.save();
  return product;
};

const deleteProduct = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) throw new AppError("Product not found", 404);

  if (product.image) {
    const imagePath = path.join(__dirname, '..', product.image);
    fs.unlink(imagePath, () => {});
  }

  await Product.destroy({ where: { id } });
  return true;
};

const getAllProduct = async () => {
  const products = await Product.findAll({
    attributes: ['id', 'name', 'qty', 'description', 'price', 'availability', 'productType', 'image'],
    where: { availability: 0 },
    include: [{
      model: User,
      attributes: ['id', 'email', 'district', 'phoneNumber', 'role'],
      as: 'user'
    }]
  });

  return products.map(product => ({
    id: product.id, name: product.name, qty: product.qty,
    description: product.description, price: product.price,
    availability: product.availability, productType: product.productType,
    image: product.image,
    user: {
      userId: product.user.id, email: product.user.email,
      district: product.user.district, phoneNumber: product.user.phoneNumber,
      role: product.user.role
    }
  }));
};

const getProductById = async (id) => {
  const product = await Product.findOne({
    where: { id },
    attributes: ['id', 'name', 'qty', 'description', 'price', 'availability', 'productType', 'image'],
    include: [{
      model: User,
      attributes: ['id', 'email', 'district', 'phoneNumber', 'role'],
      as: 'user'
    }]
  });

  if (!product) throw new AppError("Product not found", 404);

  return {
    id: product.id, name: product.name, qty: product.qty,
    description: product.description, price: product.price,
    availability: product.availability, productType: product.productType,
    image: product.image,
    user: {
      userId: product.user.id, email: product.user.email,
      district: product.user.district, phoneNumber: product.user.phoneNumber,
      role: product.user.role
    }
  };
};

const getProduct = async (userId) => {
  const products = await Product.findAll({
    where: { userId },
    attributes: ['id', 'name', 'qty', 'description', 'price', 'availability', 'productType', 'image'],
  });

  if (products.length === 0) throw new AppError("No products found for the user", 404);
  return products;
};

module.exports = { createProduct, updateProduct, deleteProduct, getAllProduct, getProductById, getProduct };
