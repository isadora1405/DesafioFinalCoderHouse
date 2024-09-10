const { factory } = require("../dao/factory");

const { ticketRepository } = factory();

class TicketService {
  async createTicket({ amount, purchaser, cartId }) {
    const ticketCode = this.generateUniqueCode();
    const purchaseDateTime = new Date();

    return ticketRepository.createTicket({
      code: ticketCode,
      purchase_datetime: purchaseDateTime,
      amount,
      purchaser,
      cartId,
    });
  }

  generateUniqueCode() {
    return `TICKET-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;
  }
}

module.exports = new TicketService();
