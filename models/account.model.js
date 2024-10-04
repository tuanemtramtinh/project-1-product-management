const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const accountSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    token: String,
    phone: String,
    avatar: String,
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "role",
    },
    status: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
    },
  },
  {
    timestamps: true,
  }
);

const AccountModel = mongoose.model("account", accountSchema);

module.exports = AccountModel;
