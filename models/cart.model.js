const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  products: Array,
  expireAt: {
    type: Date,
    expires: 0,
  },
}, {
  timestamps: true
});


const CartModel = mongoose.model("cart", cartSchema);

module.exports = CartModel;