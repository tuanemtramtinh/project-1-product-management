const { checkCart } = require("../../middlewares/cart.middleware");
const { getAllCategory } = require("../../middlewares/category.middleware");
const { userMiddleware } = require("../../middlewares/user.middleware");

const homeRoute = require("./home.route");
const productRoute = require("./product.route");
const cartRoute = require("./cart.route");
const orderRoute = require("./order.route");
const userRoute = require("./user.route");
const { general } = require("../../middlewares/setting.middleware");

module.exports = (app) => {
  app.use(getAllCategory);
  app.use(checkCart);
  app.use(userMiddleware);
  app.use(general);

  app.get("/", (req, res) => {
    res.redirect("/home");
  });

  app.use("/products", productRoute);

  app.use("/home", homeRoute);

  app.use("/cart", cartRoute);

  app.use("/order", orderRoute);

  app.use("/user", userRoute);

  app.get("*", (req, res) => {
    res.render("client/pages/errors/404", {
      pageTitle: "Không tìm thấy"
    })
  })
};
