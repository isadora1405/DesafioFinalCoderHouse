const express = require("express");
const produtoRouter = require('./routes/produto-router.js');
const cartRouter = require('./routes/carts-router.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use('/api/products', produtoRouter);
app.use('/api/carts', cartRouter)

app.listen(8080, () => {
    console.log("Servidor Ok.")
});
