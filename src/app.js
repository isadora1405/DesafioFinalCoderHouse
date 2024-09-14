const express = require("express");
const produtoRouter = require("./routes/produto-router.js");
const cartRouter = require("./routes/carts-router.js");
const handlebars = require("express-handlebars");
const routesView = require("./routes/view.router.js");
const chatRouter = require("./routes/chat.router.js");
const { Server } = require("socket.io");
const Products = require("./dao/models/productsModel.model.js");
const { sessionConfig } = require("./config/database.js");
const methodOverride = require("method-override");
const sessionRouter = require("./routes/sessionRoutes.js");
const userRouter = require("./routes/user-router.js");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
const env = require("./config/env");
const { factory } = require("./dao/factory.js");
const ticketRouter = require("./routes/ticket-router.js");
const mockProductRouter = require("./routes/mock-product-router.js");

const app = express();
factory();
initializePassport();
app.use(sessionConfig);
app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("TESTE", env.porta);

const port = env.PORTA;
const httpServer = app.listen(port, () => {
  `Servidor ouvindo na porta ${port}`;
});
const io = new Server(httpServer);

app.engine(
  "handlebars",
  handlebars.engine({
    helpers: {
      calculateTotal: (price, quantity) => {
        return `R$ ${(price * quantity).toFixed(2)}`;
      },
    },
  })
);
app.use(methodOverride("_method"));

app.use("/", routesView);
app.use("/realTimeProducts", routesView);
app.use("/products", routesView);
app.use("/carts", routesView);

app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

let listaProdutos;
let listaChat = [];

const initializeSocket = async () => {
  try {
    listaProdutos = await Products.find();

    io.on("connection", (socket) => {
      console.log("New client connected");
      socket.emit("productItem", listaProdutos);

      socket.on("mensagem-chat", async (data) => {
        const { user, message } = data;
        try {
          io.emit("historico-mensagens", [data]);
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
app.use("/api/sessions", sessionRouter);
app.use("/api/user", userRouter);
app.use("/api/tickets", ticketRouter);

app.use("/mockingproducts", mockProductRouter);

function getProducts() {}
