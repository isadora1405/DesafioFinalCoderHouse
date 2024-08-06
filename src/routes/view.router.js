const express = require("express");
const router = express.Router();
const authMiddleware = require("./../middleware/auth-middleware.js");
const Carts = require("../dao/models/cartsModel.model");

router.get("/", (req, res) => {
  res.render("home", { style: "index.css" });
});

router.get("/realTimeProducts", (req, res) => {
  res.render("realTimeProducts", { style: "index.css" });
});

router.get('/products', authMiddleware, (req, res)=> res.render('products', {style: "products.css"}));
router.get('/carts/:id', authMiddleware, async (req, res) => {
  
  const cart = await Carts.findById(req.params.id).populate(
    "products.productId"
  );
  res.render("carts", { cart: cart.toObject(), style: "cart.css" });
});


router.get("/login", async (req, res) => {
  res.render("login");
});

module.exports = router;
