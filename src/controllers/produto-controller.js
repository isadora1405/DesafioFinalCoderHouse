const produtos = [{id: 1, nome: "Teste"}];
const ProductManager = require('../services/product-manager');
const produtoManager = new ProductManager();

const getProdutos = ('/', (req, res) => {
    produtoManager.getProduct().then(dados => {
        res.send(dados);
    })
    
});
;
module.exports = {
    getProdutos
}