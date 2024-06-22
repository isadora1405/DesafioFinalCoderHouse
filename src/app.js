const express = require("express");
const produtoRouter = require('./routes/produto-router.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//const produtoRouter = require('./routes/produto-router.js');
//import produtoRouter from "./routes/produto-router.js";

app.use('/api/products', produtoRouter);

app.listen(8080, () => {
    console.log("Servidor Ok.")
});
