const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/product.controller");
const validate = require("../../validates/admin/product.validate");
const multer = require("multer");
const uploadCloud = require("../../middlewares/uploadCloud.middleware");

// const path = require("path");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/uploads");
//   },
//   filename: function (req, file, cb) {
//     const extensionName = path.extname(file.originalname);
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniqueSuffix + extensionName);
//   },
// });

// const upload = multer({ storage: storage });

const upload = multer();

router.get("/", controller.index);
router.patch("/change-status", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.patch("/delete", controller.delete);
router.patch("/change-position", controller.changePosition);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.uploadSingle,
  validate.createPost,
  controller.createPost
);
router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.uploadSingle,
  controller.editPatch
);
router.get("/detail/:id", controller.detail);
module.exports = router;
