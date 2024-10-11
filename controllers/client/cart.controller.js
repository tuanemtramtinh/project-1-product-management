const CartModel = require("../../models/cart.model");
const ProductModel = require("../../models/product.model");

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
        deleted: false,
        status: "active",
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

    res.render("client/pages/cart/index", {
      pageTitle: "Giỏ hàng",
      products: products,
      total: total,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.addPost = async (req, res) => {
  try {
    const productId = req.params.id;
    const cartId = req.cookies.cartId;
    const quantity = parseInt(req.body.quantity);

    const cart = await CartModel.findOne({
      _id: cartId,
    });

    const product = await ProductModel.findOne({
      _id: productId,
      deleted: false,
      status: "active",
    });
    const existProduct = cart.products.find(
      (item) => item.productId === productId
    );

    if (existProduct) {
      existProduct.quantity = existProduct.quantity + quantity;
    } else {
      const product = {
        productId: productId,
        quantity: quantity,
      };

      cart.products.push(product);
    }

    await CartModel.updateOne(
      {
        _id: cartId,
      },
      {
        products: cart.products,
      }
    );

    req.flash("success", "Thêm vào giỏ hành thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

module.exports.delete = async (req, res) => {
  try {
    const productId = req.params.id;
    const cartId = req.cookies.cartId;

    const cart = await CartModel.findOne({
      _id: cartId,
    });

    cart.products = cart.products.find((item) => item.productId !== productId);

    if (!cart.products) {
      cart.products = [];
    }

    await CartModel.updateOne(
      {
        _id: cartId,
      },
      {
        products: cart.products,
      }
    );

    req.flash("success", "Xoá sản phẩm thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

module.exports.updatePatch = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const productId = req.body.productId;
    const quantity = parseInt(req.body.quantity);

    const cart = await CartModel.findOne({
      _id: cartId,
    });

    const product = cart.products.find((item) => item.productId === productId);
    product.quantity = quantity;

    await CartModel.updateOne(
      {
        _id: cartId,
      },
      {
        products: cart.products,
      }
    );

    res.json({
      message: "success",
    });
  } catch (error) {
    console.log(error);
  }
};
