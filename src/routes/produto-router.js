const express = require('express');
const produtoController = require('./../controllers/produto-controller.js');

const router = express.Router();

router.get("/", produtoController.getProduct);
router.get("/:pid", produtoController.getProductById)
router.post("/", produtoController.addProduct)
router.delete("/:pid", produtoController.deleteProduct)
router.put("/:pid", produtoController.updateProduct)

module.exports = router;