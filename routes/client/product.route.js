const express = require('express');
const router = express.Router();

const controller = require('../../controllers/product.controller');

router.get('/', controller.index);

router.get('/create', controller.create);

router.get('/edit', controller.edit);

module.exports = router;