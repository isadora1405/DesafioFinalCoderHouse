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

    // Renderiza o ticket para confirmação
    res.render("ticket-confirmation", {
      ticket: ticketDTO,
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

// Função para confirmar a compra
const confirmPurchase = async (req, res) => {
  try {
    const { ticketId, cartId } = req.body;

    await cartsRepository.clearCart(cartId);
    logger.info("Compra confirmada.");

    return res.status(200).json({ message: "Compra confirmada com sucesso!" });
  } catch (error) {
    logger.error("Erro ao confirmar a compra:", error);
    return res
      .status(500)
      .json({ message: "Erro ao confirmar a compra", error: error.message });
  }
};

// Função para cancelar a compra e devolver os produtos ao estoque
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
    const ticket = await ticketRepository.getTicketByCartId(cartId); // Obtenha o ticket associado ao carrinho

    if (!ticket) {
      return res.status(404).json({ message: "Ticket não encontrado" });
    }

    // Renderiza a página com os detalhes do ticket
    res.render("ticket-confirmation", {
      ticket: ticket,
      cartId: cartId,
      style: "ticket.css",
    });
  } catch (error) {
    console.error("Erro ao renderizar a confirmação do ticket:", error);
    res
      .status(500)
      .json({
        message: "Erro ao renderizar o ticket de confirmação",
        error: error.message,
      });
  }
};

module.exports = {
  formalizePurchase,
  confirmPurchase,
  cancelPurchase,
  renderTicketConfirmation,
};
