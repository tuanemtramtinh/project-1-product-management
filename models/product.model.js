const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const mongoose_delete = require("mongoose-delete");
mongoose.plugin(slug);
mongoose.plugin(mongoose_delete, { deletedAt: true }, { deletedBy: true });

const productSchema = new mongoose.Schema(
  {
    title: String,
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    deleted: {
      type: Boolean,
      default: false,
    },
    category_id: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account"
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account"
    },
    featured: {
      type: String,
      default: "0"
    }
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("product", productSchema, "products");

module.exports = ProductModel;
