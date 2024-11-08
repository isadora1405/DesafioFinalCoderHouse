const mongoDB = require("./../config/database");
const env = require("./../config/env");
const MongoProductRepository = require("../repositories/mongo-product-repository");
const MongoUserRepository = require("../repositories/mongo-user-repository");
const MongoCartsRepository = require("../repositories/mongo-carts-repository");
const MongoChatRepository = require("../repositories/mongo-chat-repository");
const MongoTicketRepository = require("../repositories/mongo-ticket-repository");

const factory = () => {
  switch (env.PERSISTENCE.toUpperCase()) {
    case "MONGO":
      mongoDB.connectDB();
      return {
        productRepository: new MongoProductRepository(),
        userRepository: new MongoUserRepository(),
        cartsRepository: new MongoCartsRepository(),
        chatRepository: new MongoChatRepository(),
        ticketRepository: new MongoTicketRepository(),
        // Adicione outros repositórios aqui conforme necessário
      };
    default:
      throw new Error("Banco de dados inválido");
  }
};

module.exports = { factory };
