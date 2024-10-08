const { getAllCategory } = require('../../middlewares/category.middleware');
const homeRoute = require('./home.route');
const productRoute = require('./product.route');

module.exports = (app) => {

  app.use(getAllCategory);

  app.get('/', (req, res) => {
    res.redirect('/home');
  })

  app.use('/products', productRoute);
  
  app.use('/home', homeRoute);
}