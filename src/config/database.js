const mongoose = require("mongoose");
const mongoStore = require("connect-mongo");
const session = require("express-session");
const env = require('./env')

const connectDB = async () => {
  try {
    await mongoose.connect(
      env.BANCO_DADOS,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Banco de dados conectado");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const sessionConfig = session({
  store: mongoStore.create({
    mongoUrl:
      "mongodb+srv://isadora1405:14051992i@codercluster.43rqgyi.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=CoderCluster",
    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    ttl: 600,
  }),
  secret: "Ecommerce",
  resave: false,
  saveUninitialized: false,
});

module.exports = { connectDB, sessionConfig };
