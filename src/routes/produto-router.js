const express = require("express");
const produtoController = require("./../controllers/produto-controller.js");
const authorizationMiddleware = require("../middleware/authorizationMiddleware.js");

const router = express.Router();

router.get("/", produtoController.getProduct);
router.get("/:pid", produtoController.getProductById);
router.post(
  "/",
  authorizationMiddleware("admin"),
  produtoController.addProduct
);
router.delete(
  "/:pid",
  authorizationMiddleware("admin"),
  produtoController.deleteProduct
);
router.put(
  "/:pid",
  authorizationMiddleware("admin"),
  produtoController.updateProduct
);

module.exports = router;
