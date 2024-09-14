const mockProdutoController = require("./../controllers/mock-product-controller.js");
const express = require("express");

const router = express.Router();

router.get("/", mockProdutoController.getProduct);


module.exports = router;
