const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    address: String,
    products: Array,
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model("order", orderSchema);

module.exports = OrderModel;
