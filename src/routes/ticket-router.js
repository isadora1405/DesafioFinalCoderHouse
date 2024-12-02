const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticket-controller");
const authMiddleware = require("../middleware/auth-middleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

router.post(
  "/purchase/:cartId",
  authMiddleware,
  authorizationMiddleware("user"),
  ticketController.formalizePurchase
);

router.get(
  "/purchase/:cartId/confirm",
  authMiddleware,
  authorizationMiddleware("user"),
  ticketController.renderTicketConfirmation
);

router.post(
  "/purchase/cancel",
  authMiddleware,
  authorizationMiddleware("user"),
  ticketController.cancelPurchase
);

module.exports = router;
