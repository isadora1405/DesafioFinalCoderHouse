class TicketDTO {
  constructor(ticket) {
    this.code = ticket.code;
    this.purchase_datetime = ticket.purchase_datetime;
    this.amount = ticket.amount;
    this.purchaser = ticket.purchaser;
    this.cartId = ticket.cartId;
    this.products = ticket.products.map((product) => ({
      productId: product.productId,
      quantity: product.quantity,
    }));
  }
}

module.exports = TicketDTO;
