const ProductModel = require("../../models/product.model");

module.exports.index = async (req, res) => {
  try {
    const products = await ProductModel.find({
      deleted: false
    });

    products.forEach((item) => {
      item.priceNew = item.price*(100 - item.discountPercentage)/100;
      item.priceNew = (item.priceNew).toFixed(0);
    })

    res.render('client/pages/products/index', {
      pageTitle: 'Trang danh sách sản phẩm',
      products: products
    });
  } catch (error) {
    console.log({error}) 
  }
  
  
}

module.exports.create = (req, res) => {
  res.render('client/pages/products/index');
}

module.exports.edit = (req, res) => {
  res.render('client/pages/products/index');
}