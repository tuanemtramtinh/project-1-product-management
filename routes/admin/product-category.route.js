const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/product-category.controller");
const multer = require("multer");

const upload = multer();

const uploadCloud = require("../../middlewares/uploadCloud.middleware");

router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.uploadSingle,
  controller.createPost
);

router.patch("/change-status", controller.changeStatus);

router.patch("/change-position", controller.changePosition);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.uploadSingle,
  controller.editPatch
);

router.get("/detail/:id", controller.detail);

module.exports = router;
