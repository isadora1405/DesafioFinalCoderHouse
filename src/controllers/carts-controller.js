const CartManager = require('../services/cart-manager');
const cartManager = new CartManager();

const addNewCart = async (req, res) => {
    try {
        await cartManager.addCart(req.body);
        res.send("Dados salvos com sucesso");
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const addNewProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
    try {
        await cartManager.addProductToCart(cid, pid);
        res.send("Dados salvos com sucesso");
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getCarts = async (request, response) => {
    try {
        response.send(await cartManager.getCarts(parseInt(request.params.cid)));
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
};

const getCartById = async (request, response) => {
    try {
        response.send(await cartManager.getCartById(parseInt(request.params.cid)));
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
};

module.exports = {
    addNewCart,
    addNewProductToCart,
    getCartById,
    getCarts
}