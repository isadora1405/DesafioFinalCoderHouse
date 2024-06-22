const express = require('express');
const produtoController = require('./../controllers/produto-controller.js');

const router = express.Router();

router.get("/", produtoController.getProduct);
router.get("/:pid", produtoController.getProductById)

module.exports = router;