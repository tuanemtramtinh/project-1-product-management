const dashboardRoute = require('./dashboard.route');
const productRoute = require('./product.route');
const trashRoute = require('./trash.route');
const productCategoryRoute = require('./product-category.route');
const systemConfig = require('../../config/system');

module.exports = (app) => {
  app.use(`/${systemConfig.prefixAdmin}/dashboard`, dashboardRoute);
  app.use(`/${systemConfig.prefixAdmin}/product`, productRoute);
  app.use(`/${systemConfig.prefixAdmin}/trash`, trashRoute);
  app.use(`/${systemConfig.prefixAdmin}/product-category`, productCategoryRoute);
}