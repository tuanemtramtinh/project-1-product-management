const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema({
  title: String,
  slug: {
    type: String,
    slug: "title",
    unique: true,
  },
  parent_id: String,
  description: String,
  thumbnail: String,
  position: Number,
  deleted: {
    type: Boolean,
    default: false,
  },
  status: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "account"
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "account"
  }
}, {timestamps: true});

const ProductCategoryModel = mongoose.model(
  "productCategory",
  productCategorySchema,
  "product-category"
);

module.exports = ProductCategoryModel;
