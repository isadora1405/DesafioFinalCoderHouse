const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://isadora1405:14051992i@codercluster.43rqgyi.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=CoderCluster",
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

module.exports = connectDB;
