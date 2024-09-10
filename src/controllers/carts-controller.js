const Carts = require("../dao/models/cartsModel.model");
const Products = require("./../dao/models/productsModel.model");
const TicketService = require("./../services/ticketService.js");

const { factory } = require("./../dao/factory");
const CartDTO = require("./../dto/cart.dto");

const { cartsRepository } = factory();
const { productRepository } = factory();

const getCarts = async (req, res) => {
  try {
    const carts = await cartsRepository.getAll();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCartById = async (req, res) => {
  try {
    const cart = await cartsRepository.getById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrinho não encontrado" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addNewCart = async (req, res) => {
  try {
    const newCartDTO = new CartDTO(req.body); // Cria um DTO a partir do corpo da requisição
    await cartsRepository.create(newCartDTO);

    res.send({ result: "success", payload: newCartDTO });
  } catch (error) {
    console.log("erro", error);
    res.status(500).send("Server Error");
  }
};

const deleteAllProductsFromCart = async (req, res) => {
  try {
    const result = await cartsRepository.delete(req.params.cid);
    if (!result.deletedCount) {
      return res
        .status(404)
        .json({ success: false, msg: "Carrinho não encontrado" });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getMyCart = async (req, res) => {
  const { user } = req;

  if (!user || !user.cartId) {
    return res.status(400).json({ error: "User does not have a cart" });
  }

  try {
    await getCartById({ params: { cid: user.cartId } }, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve cart" });
  }
};

const addNewProductToMyCart = async (req, res) => {
  const { user } = req;
  if (!user || !user.cartId) {
    return res.status(400).send("User does not have a cart");
  }
  await addNewProductToCart(
    { params: { cid: user.cartId, pid: req.params.pid } },
    res
  );
};

const addNewProductToCart = async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await cartsRepository.getById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrinho não encontrado" });
    }

    const product = await Products.findById(pid);
    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado" });
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
    res.json({
      message: "Produto adicionado ao carrinho com sucesso",
      payload: cart,
    });
  } catch (error) {
    console.log("erro", error);
    res.status(500).json({ error: error.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    const cart = await Carts.findById(cid);
    if (!cart) {
      return res.status(404).send({ error: "Carrinho não encontrado" });
    }

    const productIds = products.map((p) => p.productId);
    const existingProducts = await Products.find({ _id: { $in: productIds } });
    const existingProductIds = existingProducts.map((p) => p._id.toString());

    const validProducts = products.filter((p) =>
      existingProductIds.includes(p.productId.toString())
    );

    cart.products = validProducts;
    await cart.save();

    const updatedCart = await Carts.findById(cid).populate(
      "products.productId"
    );
    res.send({ result: "success", payload: updatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

const updateProductQuantityInCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== "number" || quantity < 0) {
      return res.status(400).send({ error: "Quantidade inválida fornecida" });
    }

    const cart = await Carts.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrinho não encontrado" });
    }

    const product = await Products.findById(pid);
    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === pid
    );
    if (productIndex === -1) {
      return res
        .status(404)
        .json({ error: "Produto não encontrado no carrinho" });
    }

    cart.products[productIndex].quantity = quantity;

    await cart.save();

    const updatedCart = await Carts.findById(cid).populate(
      "products.productId"
    );
    res.json({ result: "success", payload: updatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
};

const finalizePurchase = async (req, res) => {
  const { cid } = req.params;
  const { totalAmount } = req.body;

  try {
    console.log("Iniciando a finalização da compra para o carrinho:", cid);

    // Obtém o carrinho
    const cart = await cartsRepository.getById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Carrinho não encontrado" });
    }

    console.log("Carrinho obtido:", cart);

    // Faz a chamada para formalizar a compra
    const response = await fetch(
      `http://localhost:8080/api/tickets/purchase/${cid}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalAmount,
          purchaser: req.session.user.email,
          cartId: cid,
        }),
        credentials: "include", // Inclui cookies de sessão na requisição
      }
    );

    const responseText = await response.text(); // Recebe a resposta como texto
    console.log("Conteúdo da resposta:", responseText);

    try {
      const data = JSON.parse(responseText); // Tenta analisar o texto como JSON
      console.log("Dados da resposta:", data);

      if (response.ok) {
        // Processa a resposta se for um JSON válido
        cart.products = cart.products.filter(
          (item) => unavailableProducts.includes(item.productId._id) // Compare corretamente o _id
        );
        await cartsRepository.update(cart._id, { products: cart.products });

        return res.json({
          message: "Compra concluída com sucesso",
          unavailableProducts,
        });
      } else {
        const error = data;
        return res
          .status(500)
          .json({ message: "Erro ao criar o ticket", error });
      }
    } catch (error) {
      console.error("Erro ao analisar JSON:", error);
      return res.status(500).json({ message: "Erro ao analisar a resposta" });
    }
  } catch (error) {
    console.error("Erro ao finalizar a compra:", error);
    return res.status(500).json({ message: "Erro ao finalizar a compra" });
  }
};

function generateUniqueCode() {
  return "TICKET-" + Math.random().toString(36).substring(2, 9).toUpperCase();
}

module.exports = {
  addNewCart,
  addNewProductToCart,
  addNewProductToMyCart,
  getCartById,
  getCarts,
  getMyCart,
  deleteAllProductsFromCart,
  updateCart,
  updateProductQuantityInCart,
  finalizePurchase,
};
