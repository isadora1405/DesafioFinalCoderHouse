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

    const ticketData = {
      amount: totalAmount,
      purchaser: userEmail,
      cartId: req.params.cartId,
    };

    const newTicket = await ticketRepository.createTicket(ticketData);
    const ticketDTO = new TicketDTO(newTicket);
    logger.info("Compra formalizada com sucesso.");
    return res
      .status(201)
      .json({ message: "Compra formalizada com sucesso!", ticket: ticketDTO });
  } catch (error) {
    logger.error("Erro ao formalizar a compra:", error);
    return res
      .status(500)
      .json({ message: "Erro ao formalizar a compra", error: error.message });
  }
};

module.exports = {
  formalizePurchase,
};
