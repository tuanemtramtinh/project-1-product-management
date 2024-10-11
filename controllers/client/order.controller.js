const CartModel = require("../../models/cart.model");
const ProductModel = require("../../models/product.model");
const OrderModel = require("../../models/order.model");
module.exports.index = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;

    const cart = await CartModel.findOne({
      _id: cartId,
    });

    let total = 0;

    const products = [];

    for (const product of cart.products) {
      const existProduct = await ProductModel.findOne({
        _id: product.productId,
      });

      product.priceNew = existProduct.price;
      product.discountPercentage = existProduct.discountPercentage;
      product.thumbnail = existProduct.thumbnail;
      product.title = existProduct.title;
      product.slug = existProduct.slug;

      if (product.discountPercentage > 0) {
        product.priceNew =
          product.priceNew * (1 - product.discountPercentage / 100);
        product.priceNew = product.priceNew.toFixed(0);
      }

      product.total = product.quantity * product.priceNew;

      products.push(product);

      total += product.total;
    }

    res.render("client/pages/order/index", {
      pageTitle: "Giỏ hàng",
      products: products,
      total: total,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.orderPost = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const order = req.body;

    const dataOrder = {
      fullName: order.fullName,
      phone: order.phone,
      address: order.address,
      products: [],
    };

    const cart = await CartModel.findOne({
      _id: cartId,
    });

    for (const product of cart.products) {
      const existProduct = await ProductModel.findOne({
        _id: product.productId,
      });

      product.price = existProduct.price;
      product.discountPercentage = existProduct.discountPercentage;
      product.title = existProduct.title;
      product.thumbnail = existProduct.thumbnail;
      product.slug = existProduct.slug;

      dataOrder.products.push(product);
    }

    const newOrder = await OrderModel.create(dataOrder);

    await CartModel.updateOne(
      {
        _id: cartId,
      },
      {
        products: [],
      }
    );

    // res.json("OK");
    res.redirect(`/order/success/${newOrder.id}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports.success = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await OrderModel.findOne({
      _id: orderId,
    });

    let total = 0;

    for (const product of order.products) {
      product.priceNew = product.price;
      if (product.discountPercentage > 0) {
        product.priceNew = (1 - product.discountPercentage / 100) * product.price;
        product.priceNew = product.priceNew.toFixed(0);
      }

      product.total = product.priceNew * product.quantity;

      total += product.total;
    }

    res.render("client/pages/order/success", {
      pageTitle: "Đặt hàng thành công",
      order: order,
      total: total
    });
  } catch (error) {
    console.log(error);
  }
};
