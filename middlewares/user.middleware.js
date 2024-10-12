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
