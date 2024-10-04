const { prefixAdmin } = require("../../config/system");
const ProductModel = require("../../models/product.model");
const ProductCategoryModel = require("../../models/product-category.model");
const moment = require("moment");

module.exports.index = async (req, res) => {
  try {
    const filter = { deleted: false };

    // Lọc theo trạng thái

    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Chức năng tìm kiếm theo tên

    if (req.query.keyword) {
      console.log(req.query.keyword);
      const regex = new RegExp(req.query.keyword, "i");
      filter.title = regex;
    }

    // Chức năng sắp xếp
    let sort = {};

    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    } else {
      sort["position"] = "desc";
    }

    // Chức năng phân trang

    let page = 1;
    let limitItems = 4;

    if (req.query.page) {
      page = parseInt(req.query.page);
    }

    if (req.query.limit) {
      limitItems = parseInt(req.query.limit);
    }

    const skip = (page - 1) * limitItems;

    const totalProducts = await ProductModel.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limitItems);

    // Lấy ra sản phẩm
    const products = await ProductModel.find(filter)
      .limit(limitItems)
      .skip(skip)
      .sort(sort)
      .populate("createdBy", "fullName")
      .populate("updatedBy", "fullName");

    for (const product of products) {
      if (product.createdAt) {
        product.createdAtNew = moment(product.createdAt).format(
          "dddd, Do MMM YYYY, h:mm:ss A"
        );
      }
      if (product.updatedAt) {
        product.updatedAtNew = moment(product.updatedAt).format(
          "dddd, Do MMM YYYY, h:mm:ss A"
        );
      }
    }

    res.render("admin/pages/products/index", {
      pageTitle: "Trang danh sách sản phẩm",
      products: products,
      currentPage: page,
      totalPages: totalPages,
      limitItems: limitItems,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    const data = await ProductModel.findOneAndUpdate(
      {
        _id: req.body.id,
      },
      {
        status: req.body.status,
      }
    );
    req.flash("success", "Thay đổi trạng thái thành công");
    res.json(data);
  } catch (error) {
    console.log(error);
  }
};

module.exports.changeMulti = async (req, res) => {
  try {
    let data;
    if (req.body.status === "delete") {
      data = await ProductModel.updateMany(
        {
          _id: req.body.ids,
        },
        {
          deleted: true,
        }
      );
      req.flash("success", "Xoá sản phẩm thành công");
    } else {
      data = await ProductModel.updateMany(
        {
          _id: req.body.ids,
        },
        {
          status: req.body.status,
        }
      );
      req.flash("success", "Thay đổi trạng thái thành công");
    }

    res.json(data);
  } catch (error) {
    console.log(error);
  }
};

module.exports.delete = async (req, res) => {
  try {
    // console.log(req.body);
    const data = await ProductModel.findOneAndUpdate(
      {
        _id: req.body.id,
      },
      {
        deleted: true,
      },
      { new: true }
    );
    req.flash("success", "Xoá sản phẩm thành công");
    res.json(data);
  } catch (error) {
    console.log(error);
  }
};

module.exports.changePosition = async (req, res) => {
  try {
    const data = await ProductModel.findByIdAndUpdate(req.body.id, {
      position: parseInt(req.body.position),
    });
    req.flash("success", "Thay đổi vị trí thành công");
    res.json(data);
  } catch (error) {
    console.log(error);
  }
};

module.exports.create = async (req, res) => {
  try {
    const listCategory = await ProductCategoryModel.find({ deleted: false });

    res.render("admin/pages/products/create", {
      pageTitle: "Trang thêm mới sản phẩm",
      listCategory: listCategory,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.createPost = async (req, res) => {
  try {
    if (res.locals.user.role_id.permissions.includes("products_create")) {
      req.body.price = parseInt(req.body.price);
      req.body.discountPercentage = parseInt(req.body.discountPercentage);
      req.body.stock = parseInt(req.body.stock);
      if (req.body.position) {
        req.body.position = parseInt(req.body.position);
      } else {
        const countDocuments = await ProductModel.countDocuments();
        req.body.position = countDocuments + 1;
      }

      req.body.createdBy = res.locals.user._id;
      req.body.updatedBy = res.locals.user._id;

      await ProductModel.create(req.body);
    }
    res.redirect(`/${prefixAdmin}/product`);
  } catch (error) {
    console.log(error);
  }
};

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await ProductModel.findById(id);
    const listCategory = await ProductCategoryModel.find({ deleted: false });
    res.render("admin/pages/products/edit", {
      pageTitle: "Trang chỉnh sửa sản phẩm",
      product: product,
      listCategory: listCategory,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    if (res.locals.user.role_id.permissions.includes("products_edit")) {
      const id = req.params.id;

      if (req.body.price) {
        req.body.price = parseInt(req.body.price);
      }

      if (req.body.discountPercentage) {
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
      }

      if (req.body.stock) {
        req.body.stock = parseInt(req.body.stock);
      }

      if (req.body.position) {
        req.body.position = parseInt(req.body.position);
      }

      req.body.updatedBy = res.locals.user._id;

      const product = await ProductModel.updateOne(
        { _id: id, deleted: false },
        req.body
      );

      req.flash("success", "Cập nhật thành công!");
      res.redirect("back");
    } else {
      res.redirect(`/${prefixAdmin}/product`);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.detail = async (req, res) => {
  const id = req.params.id;

  const product = await ProductModel.findById(id);

  res.render("admin/pages/products/detail", {
    pageTitle: "Chi tiết sản phẩm",
    product: product,
  });
};
