const express = require("express");
const cartsController = require("./../controllers/carts-controller.js");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware.js");
const setUserInRequest = require("../middleware/setUserInRequest.js");

router.get(
  "/my-cart",
  authMiddleware,
  setUserInRequest,
  cartsController.getMyCart
);
router.post("/:pid", cartsController.addNewProductToMyCart);
router.post("/", cartsController.addNewCart);
router.post("/:cid/products/:pid", cartsController.addNewProductToCart);
router.get("/", cartsController.getCarts);
router.get("/:cid", cartsController.getCartById);
router.delete("/:cid", cartsController.deleteAllProductsFromCart);
router.put("/:cid", cartsController.updateCart);
router.put("/:cid/products/:pid", cartsController.updateProductQuantityInCart);

module.exports = router;
