const ProductModel = require("../../models/product.model");

module.exports.index = async (req, res) => {
  const productsFeatured = await ProductModel.find({
    deleted: false,
    status: "active",
    featured: "1",
  }).limit(6);

  productsFeatured.forEach((item) => {
    item.priceNew = (item.price * (100 - item.discountPercentage)) / 100;
    item.priceNew = item.priceNew.toFixed(0);
  });

  const productsNew = await ProductModel.find({
    deleted: false,
    status: "active",
  })
    .limit(6)
    .sort({
      position: "desc",
    });

  productsNew.forEach((item) => {
    item.priceNew = (item.price * (100 - item.discountPercentage)) / 100;
    item.priceNew = item.priceNew.toFixed(0);
  });

  const productsDiscount = await ProductModel.find({
    deleted: false,
    status: "active",
  })
    .limit(6)
    .sort({
      discountPercentage: "desc",
    });

  productsDiscount.forEach((item) => {
    item.priceNew = (item.price * (100 - item.discountPercentage)) / 100;
    item.priceNew = item.priceNew.toFixed(0);
  });

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: productsFeatured,
    productsNew: productsNew,
    productsDiscount: productsDiscount
  });
};
