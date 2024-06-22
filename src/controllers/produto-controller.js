const produtos = [{id: 1, nome: "Teste"}];
const ProductManager = require('../services/product-manager');
const productManager = new ProductManager();

const getProduct = ('/', (request, response) => {
    const limit = request.query.limit;
    productManager.getProduct().then(res => {
        if (limit && res.length && res.length > limit) {
            response.send(res.slice(0, limit));
            return;
        }
            response.send(res);
    }).catch(erro => {
        response.send("errro: ", erro);
    })    
});

module.exports = {
    getProduct
}