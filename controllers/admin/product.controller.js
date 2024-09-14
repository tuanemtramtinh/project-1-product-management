const ProductModel = require("../../models/product.model");

module.exports.index = async (req, res) => {
  try {
    const filter = { deleted: false };

    // Lọc theo trạng thái

    if (req.query.status){
      filter.status = req.query.status;
    }

    // Chức năng tìm kiếm theo tên

    if (req.query.keyword){
      console.log(req.query.keyword);
      const regex = new RegExp(req.query.keyword, 'i');
      filter.title = regex;
    }

    // Chức năng phân trang

    let page = 1;
    let limitItems = 4;

    if (req.query.page){
      page = parseInt(req.query.page);
    }

    if (req.query.limit){
      limitItems = parseInt(req.query.limit);
    }

    const skip = (page - 1) * limitItems;   

    const totalProducts = await ProductModel.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limitItems);

    // Lấy ra sản phẩm
    const products = await ProductModel.find(filter).limit(limitItems).skip(skip);

    res.render("admin/pages/products/index", {
      pageTitle: "Trang danh sách sản phẩm",
      products: products,
      currentPage: page,
      totalPages: totalPages
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    const data = await ProductModel.findOneAndUpdate({
      _id: req.body.id
    },{
      status: req.body.status
    })
    res.json(data);
  } catch (error) {
    console.log(error);
  }
}

module.exports.changeMulti = async (req, res) => {
  try {
    const data = await ProductModel.updateMany({
      _id: req.body.ids
    }, {
      status: req.body.status
    })
    res.json(data);
  } catch (error) {
    console.log(error);
  }
}

module.exports.delete = async (req, res) => {
  try {
    console.log(req.body);
    const data = await ProductModel.findOneAndUpdate({
      _id: req.body.id
    }, {
      deleted: true
    }, { new: true });
    res.json(data);
  } catch (error) {
    
  }
}