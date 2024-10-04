const AccountModel = require("../../models/account.model");
const RoleModel = require("../../models/role.model");
const md5 = require("md5");
const generateHelper = require("../../helpers/generate.helper");
const systemConfig = require("../../config/system");
const moment = require("moment");

module.exports.index = async (req, res) => {
  try {
    const accountsList = await AccountModel.find({
      deleted: false,
    })
      .populate("role_id")
      .populate("createdBy", "fullName")
      .populate("updatedBy", "fullName");

    for (const account of accountsList) {
      account.createdAtNew = moment(account.createdAt).format(
        "dddd, Do MMM YYYY, h:mm:ss A"
      );
      account.updatedAtNew = moment(account.updatedAt).format(
        "dddd, Do MMM YYYY, h:mm:ss A"
      );
    }

    res.render("admin/pages/accounts/index", {
      pageTitle: "Tài khoản quản trị",
      records: accountsList,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.create = async (req, res) => {
  try {
    const roles = await RoleModel.find({
      deleted: false,
    });

    res.render("admin/pages/accounts/create", {
      pageTitle: "Tạo tài khoản mới",
      roles: roles,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.createPost = async (req, res) => {
  try {
    if (res.locals.user.role_id.permissions.includes("accounts_create")) {
      req.body.token = generateHelper.generateRandomString(30);
      req.body.password = md5(req.body.password);
      req.body.createdBy = res.locals.user._id;
      req.body.udpatedBy = res.locals.user._id;

      await AccountModel.create(req.body);
    }
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  } catch (error) {
    console.log(error);
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    
  } catch (error) {
    console.log(error);
  }
}

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const account = await AccountModel.findOne({
      _id: id,
      deleted: false,
    });

    const roles = await RoleModel.find({ deleted: false });

    res.render("admin/pages/accounts/edit", {
      pageTitle: "Chỉnh sửa tài khoản",
      account: account,
      roles: roles,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    if (res.locals.user.role_id.permissions.includes("accounts_edit")) {
      req.body.updatedBy = req.locals.user._id;
      await AccountModel.updateOne(req.body);
      req.flash("success", "Cập nhật tài khoản thành công");
      res.redirect("back");
    } else {
      res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.changePassword = async (req, res) => {
  try {
    const id = req.params.id;

    const account = await AccountModel.findOne({
      _id: id,
      deleted: false,
    });

    res.render("admin/pages/accounts/change-password", {
      pageTitle: "Đổi mật khẩu",
      account: account,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.changePasswordPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const hashedPassword = md5(req.body.password);
    await AccountModel.updateOne(
      {
        _id: id,
        deleted: false,
      },
      {
        password: hashedPassword,
      }
    );

    req.flash("success", "Cập nhật mật khẩu thành công!");
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  } catch (error) {
    console.log(error);
  }
};
