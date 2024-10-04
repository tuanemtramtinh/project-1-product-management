const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    permissions: {
      type: Array,
      default: [],
    },
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

const RoleModel = mongoose.model("role", roleSchema);

module.exports = RoleModel;
