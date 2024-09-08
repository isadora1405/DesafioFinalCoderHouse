const mongoDB = require('./../config/database');
const env = require('./../config/env')

console.log("Valor", env.PERSISTENCE.toUpperCase())

const factory = () => {
  switch (env.PERSISTENCE.toUpperCase()) {
    case 'MONGO':
      return mongoDB.connectDB();
    default:
      throw new Error('Banco de dados inválido');
  }
};

module.exports = {factory };



