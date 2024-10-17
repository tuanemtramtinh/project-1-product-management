const UserModel = require("../models/user.model");

module.exports.userMiddleware = async (req, res, next) => {
  try {
    if (req.cookies.tokenUser) {
      const user = await UserModel.findOne({
        token: req.cookies.tokenUser,
      });

      if (user) {
        res.locals.user = user;
      }

      // console.log(user);
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports.requireAuth = async (req, res, next) => {
  try {
    if (req.cookies.tokenUser) {
      const user = await UserModel.findOne({
        token: req.cookies.tokenUser,
        deleted: false,
        status: "active",
      });

      if (!user) {
        req.flash("error", "Vui lòng đăng nhập!");
        res.redirect("/user/login");
        return;
      }
    } else {
      req.flash("error", "Vui lòng đăng nhập!");
      res.redirect("/user/login");
      return;
    }
  } catch (error) {
    console.log(error);
  }
};
