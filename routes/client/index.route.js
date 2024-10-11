const { checkCart } = require("../../middlewares/cart.middleware");
const { getAllCategory } = require("../../middlewares/category.middleware");

const homeRoute = require("./home.route");
const productRoute = require("./product.route");
const cartRoute = require("./cart.route");
const orderRoute = require("./order.route");

module.exports = (app) => {
  app.use(getAllCategory);
  app.use(checkCart);

  app.get("/", (req, res) => {
    res.redirect("/home");
  });

  app.use("/products", productRoute);

  app.use("/home", homeRoute);

  app.use("/cart", cartRoute);

  app.use("/order", orderRoute);
};
