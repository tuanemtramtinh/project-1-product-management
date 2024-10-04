const systemConfig = require("../config/system");
const AccountModel = require("../models/account.model");

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.token) {
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    return;
  }

  const user = await AccountModel.findOne({
    token: req.cookies.token,
    deleted: false,
    status: "active"
  }).populate("role_id");

  if(!user) {
    res.clearCookie("token");
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    return;
  }

  res.locals.user = user;
  
  next();
}