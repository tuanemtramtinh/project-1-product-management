const dashboardRoute = require("./dashboard.route");
const productRoute = require("./product.route");
const trashRoute = require("./trash.route");
const productCategoryRoute = require("./product-category.route");
const accountRoute = require("./account.route");
const roleRoute = require("./role.route");
const authRoute = require("./auth.route");
const settingRoute = require("./setting.route");

const systemConfig = require("../../config/system");
const authMiddleware = require("../../middlewares/auth.middleware");

module.exports = (app) => {
  app.use(
    `/${systemConfig.prefixAdmin}/dashboard`,
    authMiddleware.requireAuth,
    dashboardRoute
  );
  app.use(
    `/${systemConfig.prefixAdmin}/product`,
    authMiddleware.requireAuth,
    productRoute
  );
  app.use(
    `/${systemConfig.prefixAdmin}/trash`,
    authMiddleware.requireAuth,
    trashRoute
  );
  app.use(
    `/${systemConfig.prefixAdmin}/product-category`,
    authMiddleware.requireAuth,
    productCategoryRoute
  );
  app.use(
    `/${systemConfig.prefixAdmin}/role`,
    authMiddleware.requireAuth,
    roleRoute
  );
  app.use(
    `/${systemConfig.prefixAdmin}/accounts`,
    authMiddleware.requireAuth,
    accountRoute
  );

  app.use(
    `/${systemConfig.prefixAdmin}/settings`,
    authMiddleware.requireAuth,
    settingRoute
  );

  app.use(`/${systemConfig.prefixAdmin}/auth`, authRoute);
};
