const {
  generateRandomString,
  generateRandomNumber,
} = require("../../helpers/generate.helper");
const { sendMail } = require("../../helpers/sendMail.helper");
const ForgotPasswordModel = require("../../models/forgot-password.model");
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

    const existUser = await UserModel.findOne({
      email: req.body.email,
      deleted: false,
    });

    console.log(existUser);

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

module.exports.forgotPassword = (req, res) => {
  try {
    res.render("client/pages/user/forgot-password", {
      pageTitle: "Lấy lại mật khẩu",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.forgotPasswordPost = async (req, res) => {
  try {
    const email = req.body.email;

    const existUser = await UserModel.find({
      email: email,
      deleted: false,
      status: "active",
    });

    if (!existUser) {
      req.flash("error", "Tài khoản không tồn tại");
      res.redirect("back");
      return;
    }

    // Việc 1: Lưu email và mã OTP vào database
    const existEmailInForgotPassword = await ForgotPasswordModel.findOne({
      email: email,
    });

    if (!existEmailInForgotPassword) {
      const otp = generateRandomNumber(6);

      const data = {
        email: email,
        otp: otp,
        expireAt: Date.now() + 5 * 60 * 1000,
      };

      const record = new ForgotPasswordModel(data);
      await record.save();

      //Việc 2: Gửi mã OTP qua email cho User

      const subject = "Xác thực mã OTP";
      const text = `Mã xác thực của bạn là <b>${otp}</b>. Mã OTP có hiệu lực trong vòng 5 phút, vui lòng không cung cấp mã OTP cho bất kỳ ai.`;

      sendMail(email, subject, text);
    }

    res.redirect(`/user/password/otp?email=${email}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports.otpPassword = (req, res) => {
  try {
    const email = req.query.email;
    res.render("client/pages/user/otp-password", {
      pageTitle: "Xác thực OTP",
      email: email,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.otpPasswordPost = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;

    const existRecord = await ForgotPasswordModel.findOne({
      email: email,
      otp: otp,
    });

    if (!existRecord) {
      req.flash("error", "Mã OTP không hợp lệ");
      res.redirect("back");
      return;
    }

    const user = await UserModel.findOne({
      email: email,
    });

    res.cookie("tokenUser", user.token);

    res.redirect("/user/password/reset");
  } catch (error) {
    console.log(error);
  }
};

module.exports.resetPassword = (req, res) => {
  try {
    res.render("client/pages/user/reset-password", {
      pageTitle: "Đổi mật khẩu",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.resetPasswordPost = async (req, res) => {
  try {
    const tokenUser = req.cookies.tokenUser;
    const newPassword = req.body.password;

    console.log(tokenUser, newPassword);

    await UserModel.updateOne(
      {
        token: tokenUser,
      },
      {
        password: md5(newPassword),
      }
    );

    req.flash("success", "Đổi mật khẩu thành công!");
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

module.exports.profile = (req, res) => {
  try {
    res.render("client/pages/user/profile", {
      pageTitle: "Thông tin cá nhân"
    })
  } catch (error) {
    console.log(error);
  }
}