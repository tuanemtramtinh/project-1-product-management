const { generateRandomString } = require("../../helpers/generate.helper");
const UserModel = require("../../models/user.model");
const md5 = require("md5");

module.exports.register = (req, res) => {
  try {
    res.render("client/pages/user/register", {
      pageTitle: "Trang Đăng Ký",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.registerPost = async (req, res) => {
  try {
    const token = generateRandomString(20);

    const existUser = UserModel.findOne({
      email: req.body.email,
      deleted: false,
    });

    if (existUser) {
      req.flash("error", "Email đã tồn tại");
      res.redirect("back");
      return;
    }

    const newUser = new UserModel({
      fullName: req.body.fullName,
      email: req.body.email,
      password: md5(req.body.password),
      token: token,
    });

    await newUser.save();

    req.flash("success", "Đăng ký tài khoản thành công");
    res.cookie("tokenUser", token);
    res.redirect("/home");
  } catch (error) {
    console.log(error);
  }
};

module.exports.login = (req, res) => {
  try {
    res.render("client/pages/user/login", {
      pageTitle: "Trang Đăng Nhập",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.loginPost = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const existUser = await UserModel.findOne({
      email: email,
      deleted: false,
      status: "active",
    });

    if (!existUser) {
      req.flash("error", "Người dùng không tồn tại");
      res.redirect("/user/register");
      return;
    }

    if (md5(password) !== existUser.password) {
      req.flash("error", "Sai mật khẩu");
      res.redirect("back");
      return;
    }

    if (existUser.status !== "active") {
      req.flash("error", "Tài khoản đang bị khóa!");
      res.redirect("back");
      return;
    }

    res.cookie("tokenUser", existUser.token);
    req.flash("success", "Đăng nhập thành công");
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

module.exports.logout = (req, res) => {
  try {
    res.clearCookie("tokenUser");
    req.flash("success", "Đã đăng xuất!");
    res.redirect("/home");
  } catch (error) {
    console.log(error);
  }
};
