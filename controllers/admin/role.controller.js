const RoleModel = require("../../models/role.model");
const systemConfig = require("../../config/system");
const moment = require("moment");

module.exports.index = async (req, res) => {
  const roleList = await RoleModel.find({
    deleted: false,
  })
    .populate("createdBy", "fullName")
    .populate("updatedBy", "fullName");

  for (const role of roleList) {
    role.createdAtNew = moment(role.createdAt).format(
      "dddd, Do MMM YYYY, h:mm:ss A"
    );
    role.updatedAtNew = moment(role.updatedAt).format(
      "dddd, Do MMM YYYY, h:mm:ss A"
    );
  }

  res.render("admin/pages/roles/index", {
    pageTitle: "Nhóm quyền",
    records: roleList,
  });
};

module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Trang tạo nhóm quyền",
  });
};

module.exports.createPost = async (req, res) => {
  try {
    if (res.locals.user.role_id.permissions.includes("roles_create")) {
      req.body.createdBy = res.locals.user._id;
      req.body.updatedBy = res.locals.user._id;

      await RoleModel.create(req.body);
      res.redirect(`/${systemConfig.prefixAdmin}/role`);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const role = await RoleModel.findOne({
      _id: id,
      deleted: false,
    });

    res.render("admin/pages/roles/edit", {
      pageTitle: "Chỉnh sửa nhóm quyền",
      role: role,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    if (res.locals.user.role_id.permissions.includes("roles_edit")) {
      const id = req.params.id;

      req.body.createdBy = res.locals.user._id;

      await RoleModel.updateOne(
        {
          _id: id,
          deleted: false,
        },
        req.body
      );

      req.flash("success", "Cập nhật thành công");

      res.redirect("back");
    } else {
      res.redirect(`/${systemConfig.prefixAdmin}/role`);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.permissions = async (req, res) => {
  try {
    const roleList = await RoleModel.find({ deleted: false });

    res.render("admin/pages/roles/permissions", {
      pageTitle: "Phân quyền",
      records: roleList,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.permissionsPatch = async (req, res) => {
  try {
    if (res.locals.user.role_id.permissions.includes("roles_permissions")) {
      for (const item of req.body) {
        await RoleModel.updateOne(
          {
            _id: item.id,
            deleted: false,
          },
          {
            permissions: item.permissions,
          }
        );
      }

      req.flash("success", "Cập nhật phân quyền thành công");
      res.json({ messages: "success" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const role = await RoleModel.findOne({
      _id: id,
      deleted: false,
    });

    console.log(role);

    res.render("admin/pages/roles/detail", {
      pageTitle: "Trang chi tiết nhóm quyền",
      role: role,
    });
  } catch (error) {
    console.log(error);
  }
};
