const CartModel = require("../models/cart.model");

module.exports.checkCart = async (req, res, next) => {
  try {
    if (!req.cookies.cartId) {
      const expiresDay = 365 * 24 * 60 * 60 * 1000;

      const cart = new CartModel({
        expireAt: Date.now() + expiresDay,
      });
      await cart.save();

      res.cookie("cartId", cart.id, {
        expires: new Date(Date.now() + expiresDay),
      });

      res.locals.miniCart = 0;
    } else {
      const cart = await CartModel.findOne({
        _id: req.cookies.cartId,
      });

      res.locals.miniCart = cart.products.length;
    }

    next();
  } catch (error) {
    console.log(error);
  }
};
