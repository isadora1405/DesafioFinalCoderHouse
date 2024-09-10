const express = require("express");
const cartsController = require("./../controllers/carts-controller.js");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware.js");
const setUserInRequest = require("../middleware/setUserInRequest.js");
const authorizationMiddleware = require("../middleware/authorizationMiddleware.js");

router.get(
  "/my-cart",
  authMiddleware,
  setUserInRequest,
  cartsController.getMyCart
);

router.get("/", cartsController.getCarts);
router.get("/:cid", cartsController.getCartById);
router.post("/", cartsController.addNewCart);
router.post(
  "/:cid/purchase",
  authMiddleware,
  authorizationMiddleware("user"),
  cartsController.finalizePurchase
);
router.delete("/:cid", cartsController.deleteAllProductsFromCart);

router.post(
  "/:pid",
  authorizationMiddleware("user"),
  cartsController.addNewProductToMyCart
);
router.post(
  "/:cid/products/:pid",
  authorizationMiddleware("user"),
  cartsController.addNewProductToCart
);
router.put("/:cid", cartsController.updateCart);
router.put("/:cid/products/:pid", cartsController.updateProductQuantityInCart);

module.exports = router;
