const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/trash.controller");

router.get("/", controller.index);
router.patch("/restore", controller.restore);
router.patch("/restore-multi", controller.restoreMulti);

module.exports = router;
