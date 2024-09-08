const mongoDB = require('./../config/database');
const env = require('./../config/env');
const MongoProductRepository = require('../repositories/mongo-product-repository');
const MongoCartsRepository = require('../repositories/mongo-carts-repository');
const MongoChatRepository = require('../repositories/mongo-chat-repository');

const factory = () => {
  switch (env.PERSISTENCE.toUpperCase()) {
    case 'MONGO':
      mongoDB.connectDB();
      return {
        productRepository: new MongoProductRepository(),
        cartsRepository: new MongoCartsRepository(),
        chatRepository: new MongoChatRepository()
        // Adicione outros repositórios aqui conforme necessário
      }
    default:
      throw new Error('Banco de dados inválido');
  }
};

module.exports = {factory };



