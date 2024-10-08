const { getAllCategory } = require("../helpers/category.helper");
const ProductCategoryModel = require("../models/product-category.model");

module.exports.getAllCategory = async (req, res, next) => {
  try {
    const categoryList = await ProductCategoryModel.find({deleted: false, status: "active"});

    res.locals.allCategory = getAllCategory(categoryList);
    
    next();
  } catch (error) {
    console.log(error);
  } 
}