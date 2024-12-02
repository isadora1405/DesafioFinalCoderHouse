const TicketDTO = require("../dto/ticket.dto");
const { factory } = require("../dao/factory");
const logger = require("./../utils/logger.js");

const { cartsRepository } = factory();
const { ticketRepository } = factory();

const formalizePurchase = async (req, res) => {
  try {
    const userEmail = req.session.user.email;
    const cart = await cartsRepository.getById(req.params.cartId);

    if (!cart || cart.products.length === 0) {
      logger.warning("Tentativa de formalizar compra com carrinho vazio.");
      return res
        .status(400)
        .json({ message: "Carrinho vazio ou não encontrado" });
    }

    const totalAmount = cart.products.reduce(
      (acc, item) => acc + item.productId.price * item.quantity,
      0
    );

    const ticketPreview = {
      amount: totalAmount,
      purchaser: userEmail,
      cartId: req.params.cartId,
      products: cart.products,
    };

    logger.info("Compra formalizada e ticket criado temporariamente.");

    res.render("ticket", {
      ticket: ticketPreview,
      cartId: req.params.cartId,
      style: "ticket.css",
    });
  } catch (error) {
    logger.error("Erro ao formalizar a compra:", error);
    return res
      .status(500)
      .json({ message: "Erro ao formalizar a compra", error: error.message });
  }
};

const cancelPurchase = async (req, res) => {
  try {
    const { cartId } = req.body;

    const cart = await cartsRepository.getById(cartId);
    for (let item of cart.products) {
      await productsRepository.incrementStock(
        item.productId._id,
        item.quantity
      );
    }

    logger.info("Compra cancelada e produtos devolvidos ao estoque.");
    return res
      .status(200)
      .json({ message: "Compra cancelada e produtos devolvidos ao estoque." });
  } catch (error) {
    logger.error("Erro ao cancelar a compra:", error);
    return res
      .status(500)
      .json({ message: "Erro ao cancelar a compra", error: error.message });
  }
};

const renderTicketConfirmation = async (req, res) => {
  try {
    const cartId = req.params.cartId;

    const cart = await cartsRepository.getById(cartId);
    console.log(cart);
    if (!cart || cart.products.length === 0) {
      return res
        .status(404)
        .json({ message: "Carrinho vazio ou não encontrado" });
    }

    const totalAmount = cart.products.reduce(
      (acc, item) => acc + item.productId.price * item.quantity,
      0
    );

    const ticketPreview = {
      code: `PREVIEW-${Date.now()}`,
      amount: totalAmount,
      purchaser: req.session.user.email,
      cartId: cartId,
      purchase_datetime: new Date(),
      items: cart.products.map((item) => ({
        name: item.productId.title,
        price: item.productId.price,
        quantity: item.quantity,
      })),
    };

    console.log(ticketPreview);

    res.render("ticket", {
      ticket: ticketPreview,
      cartId: cartId,
      style: "ticket.css",
    });
  } catch (error) {
    logger.error("Erro ao renderizar o ticket de confirmação:", error);
    res.status(500).json({
      message: "Erro ao renderizar o ticket de confirmação",
      error: error.message,
    });
  }
};

module.exports = {
  formalizePurchase,
  cancelPurchase,
  renderTicketConfirmation,
};
