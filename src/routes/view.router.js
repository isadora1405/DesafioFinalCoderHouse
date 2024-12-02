const express = require("express");
const router = express.Router();
const authMiddleware = require("./../middleware/auth-middleware.js");
const Carts = require("../dao/models/cartsModel.model");
const Ticket = require("../dao/models/ticketModel.model.js");

router.get("/", (req, res) => {
  res.render("home", { style: "index.css" });
});

router.get("/realTimeProducts", (req, res) => {
  res.render("realTimeProducts", { style: "index.css" });
});

router.get("/products", authMiddleware, (req, res) =>
  res.render("products", { style: "products.css" })
);

router.get("/ticket/:ticketId", authMiddleware, async (req, res) => {
  try {
    const ticketId = req.params.ticketId;

    const ticket = await Ticket.findById(ticketId).populate(
      "products.productId"
    );
    if (!ticket) {
      return res.status(404).send("Ticket não encontrado.");
    }

    const ticketObject = ticket.toObject();

    res.render("ticket", { ticket: ticketObject, style: "ticket.css" });
  } catch (error) {
    res.status(500).send("Erro ao processar a compra.");
  }
});

router.get("/carts/:id", authMiddleware, async (req, res) => {
  try {
    const cart = await Carts.findById(req.params.id).populate(
      "products.productId"
    );
    if (!cart) {
      return res.status(404).send("Carrinho não encontrado");
    }
    res.render("carts", { cart: cart.toObject(), style: "cart.css" });
  } catch (error) {
    res.status(500).send("Erro interno do servidor");
  }
});

router.get("/login", async (req, res) => {
  res.render("login", { style: "login.css" });
});

router.get("/users", authMiddleware, (req, res) =>
  res.render("users", { style: "users.css" })
);

module.exports = router;
