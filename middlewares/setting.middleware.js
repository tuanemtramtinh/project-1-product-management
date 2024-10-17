const SettingModel = require("../models/setting.model");

module.exports.general = async (req, res, next) => {
  try {
    const settingGeneral = await SettingModel.findOne({});

    res.locals.settingGeneral = settingGeneral;

    next();
  } catch (error) {
    console.log(error);
  }
};
