const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  discountPercentage: Number,
  stock: Number,
  thumbnail: String,
  status: String,
  position: Number,
  deleted: Boolean
}) 

const ProductModel = mongoose.model(
  'product', 
  productSchema, 
  'products'
);

module.exports = ProductModel;