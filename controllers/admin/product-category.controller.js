const ProductCategoryModel = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const prefixAdmin = systemConfig.prefixAdmin;
module.exports.index = (req, res) => {
  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh sách danh mục sản phẩm",
  });
};

module.exports.create = async (req, res) => {
  const listCategory = await ProductCategoryModel.find({
    deleted: false
  })


  res.render("admin/pages/products-category/create", {
    pageTitle: "Trang tạo mới danh mục sản phẩm",
    listCategory: listCategory
  });
};

module.exports.createPost = async (req, res) => {
  try {
    if (req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const countDocuments = await ProductCategoryModel.countDocuments();
      req.body.position = countDocuments + 1;
    }

    await ProductCategoryModel.create(req.body);

    res.redirect(`/${prefixAdmin}/product-category`);
  } catch (error) {
    console.log(error);
  }
};
