const ProductModel = require("../../models/product.model");

module.exports.index = async (req, res) => {
  try {
    const products = await ProductModel.find({ deleted: true });

    res.render("admin/pages/trash/index", {
      pageTitle: "Thùng rác",
      products: products,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.restore = async (req, res) => {
  try {
    const data = await ProductModel.findOneAndUpdate(
      { _id: req.body.id },
      { deleted: false }
    );
    res.json(data);
  } catch (error) {
    console.log(error);
  }
};

module.exports.restoreMulti = async (req, res) => {
  try {
    const data = await ProductModel.updateMany(
      { _id: req.body.ids },
      { deleted: false }
    );
    res.json(data);
  } catch (error) {
    console.log(error);
  }
};
