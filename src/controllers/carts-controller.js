const Carts = require("../dao/models/cartsModel.model");
const Products = require("./../dao/models/productsModel.model");

const addNewCart = async (req, res) => {
  try {
    const newCart = new Carts(req.body);
    await newCart.save();

    res.send({ result: "success", payload: newCart });
  } catch (error) {
    console.log("erro", error);
    res.status(500).send("Server Error");
  }
};

const addNewProductToCart = async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await Carts.findById(cid);
    if (!cart) {
      return res.status(404).send({ error: "Carrinho não encontrado" });
    }

    const product = await Products.findById(pid);
    if (!product) {
      return res.status(404).send({ error: "Produto não encontrado" });
    }

    const existingProductIndex = cart.products.findIndex(
      (p) => p.productId.toString() === pid
    );
    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += 1;
    } else {
      cart.products.push({ productId: pid, quantity: 1 });
    }

    await cart.save();
    res.send("Produto adicionado ao carrinho com sucesso");
  } catch (error) {
    console.log("erro", error);
    res.status(500).json({ error: error.message });
  }
};

const getCarts = async (req, res) => {
  try {
    const carts = await Carts.find();
    res.send({ result: "success", payload: carts });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

const getCartById = async (req, res) => {
  try {
    const cart = await Carts.findById(req.params.cid);
    if (!cart) {
      return res.status(404).send({ error: "Carrinho não encontrado" });
    }
    res.send(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addNewCart,
  addNewProductToCart,
  getCartById,
  getCarts,
};
