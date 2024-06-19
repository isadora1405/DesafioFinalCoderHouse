const express = require('express');
const produtoController = require('./../controllers/produto-controller.js');

const router = express.Router();

router.get("/", produtoController.getProdutos)

module.exports = router;