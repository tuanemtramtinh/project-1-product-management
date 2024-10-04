const md5 = require("md5");
const systemConfig = require("../../config/system");

const AccountModel = require("../../models/account.model");
module.exports.login = (req, res) => {
  try {
    res.render("admin/pages/auth/login", {
      pageTitle: "Đăng Nhập",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.loginPost = async (req, res) => {
  try {
    const { email, password } = req.body;

    const account = await AccountModel.findOne({
      email: email,
      deleted: false,
    });

    if (!account) {
      req.flash("error", "Email không tồn tại");
      req.redirect("back");
      return;
    }

    if (md5(password) !== account.password) {
      req.flash("error", "Sai mật khẩu!");
      res.redirect("back");
      return;
    }

    if (account.status !== "active") {
      req.flash("error", "Tài khoản đang bị khóa!");
      res.redirect("back");
      return;
    }

    req.flash("success", "Đăng nhập thành công");
    res.cookie("token", account.token);
    res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
  } catch (error) {
    console.log(error);
  }
};

module.exports.logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
  } catch (error) {
    console.log(error);
  }
};
