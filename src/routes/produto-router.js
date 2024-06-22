const express = require('express');
const produtoController = require('./../controllers/produto-controller.js');

const router = express.Router();

router.get("/", produtoController.getProduct);
router.get("/:pid", produtoController.getProductById)
router.post("/", produtoController.addProduct)
router.delete("/", produtoController.addProduct)
router.put("/", produtoController.updateProduct)

module.exports = router;