const homeRoute = require('./home.route');
const productRoute = require('./product.route');

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.render('client/pages/home/index');
  })

  app.use('/products', productRoute);
  
  app.use('/home', homeRoute);
}