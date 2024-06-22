const produtos = [{id: 1, nome: "Teste"}];
const ProductManager = require('../services/product-manager');
const productManager = new ProductManager();

const getProduct = async (request, response) => {
    const limit = request.query.limit;

    try {
        const listProducts = await productManager.getProduct();
        if (limit && listProducts.length && listProducts.length > limit) {
            response.send(listProducts.slice(0, limit));
            return;
        }

        response.send(listProducts);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
};

const getProductById = async (request, response) => {
    try {
        response.send(await productManager.getProductById(parseInt(request.params.pid)));
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
};

const addProduct = async (req, res) => {
    try {
        await productManager.addProduct(req.body);
        res.send("Dados salvos com sucesso");
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const updateProduct = async (req, res) => {
    try {
        await productManager.updateProduct(req.body.id, req.body);
        res.send("Produto atualizado com sucesso.");
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = {
    getProduct,
    getProductById,
    addProduct,
    updateProduct
}