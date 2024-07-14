const express = require("express");
const produtoRouter = require('./routes/produto-router.js');
const cartRouter = require('./routes/carts-router.js');
const handlebars = require('express-handlebars');
const routesView = require('./routes/view.router.js');
const chatRouter = require('./routes/chat.router.js');
const {Server} = require('socket.io');
const ProductManager = require('../src/services/product-manager');
const productManager = new ProductManager();
const path = require('path')

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const port = 8080;
const httpServer = app.listen(port, ()=>{`Servidor ouvindo na porta ${port}`});
const io = new Server(httpServer);

app.engine('handlebars', handlebars.engine());
app.use('/', routesView);
app.use('/realTimeProducts', routesView);

//app.use('/chat', routerChat);
app.use(express.static(__dirname+'/public'));
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');

let listaProdutos;
let listaMensagens = [];

const initializeSocket = async () => {
    try {
        listaProdutos = await productManager.getProduct();

        io.on('connection', socket => {
            console.log('New client connected');
            socket.emit('productItem', listaProdutos);
            io.emit('historico-mensagens', listaMensagens);

            socket.on('mensagem-chat', data => {
                listaMensagens.push(data);
                io.emit('historico-mensagens', listaMensagens);
            });

            socket.on('message', data => {
                listaProdutos.push(data);
                io.emit('productItem', listaProdutos);
            });

            socket.on('deleteProduct', async id => {
                try {
                    await productManager.deleteProduct(parseInt(id));
                    listaProdutos = await productManager.getProduct();
                    io.emit('productItem', listaProdutos);
                } catch (error) {
                    console.error('Error deleting product:', error);
                }
            });

            socket.on('newProduct', async product => {
                try {
                    await productManager.addProduct(product);
                    listaProdutos = await productManager.getProduct();
                    io.emit('productItem', listaProdutos);
                } catch (error) {
                    console.error('Error adding product:', error);
                }
            });
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

initializeSocket();

app.use('/api/products', produtoRouter);
app.use('/api/carts', cartRouter);
app.use('/chat', chatRouter );
