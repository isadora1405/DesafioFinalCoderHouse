const express = require('express');
const cartsController = require('./../controllers/carts-controller.js');

const router = express.Router();

router.post("/", cartsController.addNewCart);
router.post("/:cid/products/:pid", cartsController.addNewProductToCart);
router.get("/", cartsController.getCarts);
router.get("/:cid", cartsController.getCartById);

module.exports = router;