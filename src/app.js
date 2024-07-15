const express = require("express");
const produtoRouter = require("./routes/produto-router.js");
const cartRouter = require("./routes/carts-router.js");
const handlebars = require("express-handlebars");
const routesView = require("./routes/view.router.js");
const chatRouter = require("./routes/chat.router.js");
const { Server } = require("socket.io");
const Products = require("./dao/models/productsModel.model.js");
const connectDB = require("./config/database.js");
const methodOverride = require("method-override");
const Chat = require("./dao/models/chatModel.model.js");

const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 8080;
const httpServer = app.listen(port, () => {
  `Servidor ouvindo na porta ${port}`;
});
const io = new Server(httpServer);

app.engine("handlebars", handlebars.engine());
app.use(methodOverride("_method"));

app.use("/", routesView);
app.use("/realTimeProducts", routesView);

app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

let listaProdutos;
let listaMensagens = [];

const initializeSocket = async () => {
  try {
    listaProdutos = await Products.find();

    io.on("connection", (socket) => {
      console.log("New client connected");
      socket.emit("productItem", listaProdutos);

      socket.on("mensagem-chat", async (data) => {
        const { user, message } = data;
        try {
          socket.emit("historico-mensagens", [data]);
        } catch (error) {
          console.error("Error saving message:", error.message);
        }
      });

      socket.on("message", (data) => {
        listaProdutos.push(data);
        io.emit("productItem", listaProdutos);
      });

      socket.on("deleteProduct", async (id) => {
        try {
          await Products.deleteOne({ _id: id });
          listaProdutos = await Products.find();
          io.emit("productItem", listaProdutos);
        } catch (error) {
          console.error("Error deleting product:", error);
        }
      });

      socket.on("newProduct", async (product) => {
        try {
          const newProducts = new Products(product);
          await newProducts.save();
          listaProdutos = await Products.find();
          io.emit("productItem", listaProdutos);
        } catch (error) {
          console.error("Error adding product:", error);
        }
      });
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

initializeSocket();

app.use("/api/products", produtoRouter);
app.use("/api/carts", cartRouter);
app.use("/chat", chatRouter);
