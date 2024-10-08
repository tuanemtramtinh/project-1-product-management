const ProductCategoryModel = require("../../models/product-category.model");
const ProductModel = require("../../models/product.model");

module.exports.index = async (req, res) => {
  try {
    const products = await ProductModel.find({
      deleted: false,
    }).sort({ position: "desc" });

    products.forEach((item) => {
      item.priceNew = (item.price * (100 - item.discountPercentage)) / 100;
      item.priceNew = item.priceNew.toFixed(0);
    });

    res.render("client/pages/products/index", {
      pageTitle: "Trang danh sách sản phẩm",
      products: products,
    });
  } catch (error) {
    console.log({ error });
  }
};

module.exports.category = async (req, res) => {
  try {
    const slugCategoryId = req.params.slugCategoryId;

    const category = await ProductCategoryModel.findOne({
      deleted: false,
      status: "active",
      slug: slugCategoryId,
    });

    const productList = await ProductModel.find({
      category_id: category.id,
      deleted: false,
    }).sort({
      position: "desc"
    });

    productList.forEach((item) => {
      item.priceNew = (item.price * (100 - item.discountPercentage)) / 100;
      item.priceNew = item.priceNew.toFixed(0);
    });

    res.render("client/pages/products/index", {
      pageTitle: category.title,
      products: productList
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slug;

    // console.log(slug);

    const product = await ProductModel.findOne({
      slug: slug,
      deleted: false,
      status: "active",
    });
    product.priceNew =
      (product.price * (100 - product.discountPercentage)) / 100;
    product.priceNew = product.priceNew.toFixed(0);

    // console.log(product);

    res.render("client/pages/products/detail", {
      pageTitle: "Trang Chi tiết sản phẩm",
      product: product,
    });
  } catch (error) {
    console.log(error);
  }
};
