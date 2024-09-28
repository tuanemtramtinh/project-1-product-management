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
router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.uploadSingle,
  controller.editPatch
);

module.exports = router;
