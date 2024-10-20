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

    const allCategoryChildren = [];

    const getCategoryChildren = async (parentId) => {
      const childs = await ProductCategoryModel.find({
        parent_id: parentId,
        deleted: false,
        status: "active",
      });

      for (child of childs) {
        allCategoryChildren.push(child.id);

        await getCategoryChildren(child.id);
      }
    };

    await getCategoryChildren(category.id);

    const productList = await ProductModel.find({
      category_id: { $in: [category.id, ...allCategoryChildren] },
      deleted: false,
    }).sort({
      position: "desc",
    });

    productList.forEach((item) => {
      item.priceNew = (item.price * (100 - item.discountPercentage)) / 100;
      item.priceNew = item.priceNew.toFixed(0);
    });

    res.render("client/pages/products/index", {
      pageTitle: category.title,
      products: productList,
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
    }).populate("category_id");

    // console.log(product);

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

module.exports.search = async (req, res) => {
  try {
    let products = [];

    if (req.query.keyword) {
      const keyword = new RegExp(req.query.keyword, "i");

      products = await ProductModel.find({
        title: keyword,
        deleted: false,
        status: "active",
      }).sort({
        position: "desc",
      });

      for (const item of products) {
        item.priceNew = (1 - item.discountPercentage / 100) * item.price;
        item.priceNew = item.priceNew.toFixed(0);
      }
    }

    res.render("client/pages/products/search", {
      pageTitle: `Kết quả tìm kiếm: ${req.query.keyword}`,
      keyword: req.query.keyword,
      products: products,
    });
  } catch (error) {
    console.log(error);
  }
};
