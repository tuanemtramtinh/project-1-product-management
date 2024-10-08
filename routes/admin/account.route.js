const express = require("express");
const router = express.Router();
const multer = require("multer");
const controller = require("../../controllers/admin/account.controller");
const uploadCloud = require("../../middlewares/uploadCloud.middleware");

const upload = multer();

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.uploadSingle,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("avatar"),
  uploadCloud.uploadSingle,
  controller.editPatch
);

router.get("/change-password/:id", controller.changePassword);

router.patch("/change-password/:id", controller.changePasswordPatch);

router.get("/my-profile", controller.myProfile);

module.exports = router;
