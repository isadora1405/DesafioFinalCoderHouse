const Ticket = require("../dao/models/ticketModel.model");

class MongoTicketRepository {
  async createTicket(ticketData) {
    const newTicket = new Ticket(ticketData);
    return await newTicket.save();
  }

  async findTicketByCode(code) {
    return await Ticket.findOne({ code });
  }

  async findTicketsByPurchaser(purchaserEmail) {
    return await Ticket.find({ purchaser: purchaserEmail });
  }
}

module.exports = MongoTicketRepository;
