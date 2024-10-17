const SettingModel = require("../../models/setting.model");

module.exports.general = async (req, res) => {
  try {
    const setting = await SettingModel.findOne({});

    res.render("admin/pages/settings/general", {
      pageTitle: "Cài đặt chung",
      setting: setting,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.generalPatch = async (req, res) => {
  try {
    const setting = await SettingModel.findOne({});

    if (setting) {
      await SettingModel.updateOne(req.body);
    } else {
      await SettingModel.create(req.body);
    }

    req.flash("success", "Cập nhật thành công!");
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};
