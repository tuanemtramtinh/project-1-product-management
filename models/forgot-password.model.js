const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    expireAt: {
      type: Date,
      expires: 0,
    },
  },
  {
    timestamps: true,
  }
);

const ForgotPasswordModel = mongoose.model(
  "forgotPassword",
  forgotPasswordSchema,
  "forgot-password"
);

module.exports = ForgotPasswordModel;
