const ProductCategoryModel = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const prefixAdmin = systemConfig.prefixAdmin;

module.exports.index = async (req, res) => {
  try {
    const listCategory = await ProductCategoryModel.find({
      deleted: false,
    });

    res.render("admin/pages/products-category/index", {
      pageTitle: "Danh sách danh mục sản phẩm",
      listCategory: listCategory,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.create = async (req, res) => {
  try {
    const listCategory = await ProductCategoryModel.find({
      deleted: false,
    });
    res.render("admin/pages/products-category/create", {
      pageTitle: "Trang tạo mới danh mục sản phẩm",
      listCategory: listCategory,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.createPost = async (req, res) => {
  try {
    if (
      res.locals.user.role_id.permissions.includes("products-category_create")
    ) {
      if (req.body.position) {
        req.body.position = parseInt(req.body.position);
      } else {
        const countDocuments = await ProductCategoryModel.countDocuments();
        req.body.position = countDocuments + 1;
      }

      await ProductCategoryModel.create(req.body);
    }
    res.redirect(`/${prefixAdmin}/product-category`);
  } catch (error) {
    console.log(error);
  }
};

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await ProductCategoryModel.findOne({
      _id: id,
      deleted: false,
    });

    const listCategory = await ProductCategoryModel.find({
      deleted: false,
    });

    // console.log(category);
    res.render("admin/pages/products-category/edit", {
      pageTitle: "Trang chỉnh sửa sản phẩm",
      category: category,
      listCategory: listCategory,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    if (
      res.locals.user.role_id.permissions.includes("products-category_edit")
    ) {
      const id = req.params.id;

      if (req.body.position) {
        req.body.position = parseInt(req.body.position);
      } else {
        delete req.body.position;
      }

      // console.log(req.body);

      await ProductCategoryModel.updateOne(
        {
          _id: id,
          deleted: false,
        },
        req.body
      );

      req.flash("success", "Cập nhật thành công!");
      res.redirect(`back`);
    } else {
      res.redirect(`/${systemConfig.prefixAdmin}/product-category`);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const category = await ProductCategoryModel.findOne({
      _id: id,
      deleted: false,
    });

    res.render("admin/pages/products-category/detail", {
      pageTitle: "Trang chi tiết danh mục sản phẩm",
      category: category,
    });
  } catch (error) {
    console.log(error);
  }
};
