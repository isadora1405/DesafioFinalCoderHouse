const path = require('path');
const fs = require('fs').promises;

class CartManager {
    #path;

    constructor() {
        const __dirname = path.resolve();
        this.#path = path.join(__dirname, 'src', 'storage', 'cart.json'); 
    }

    async addCart(cart) {
        const fileExist = await this.fileExists();
        let carts = [];
    
        if (fileExist) {
            carts = await this.getCarts();
        }
    
        const newCartId = await this.nextId(carts);
    
        const isDuplicateId = carts.some(cart => cart.id === newCartId);
        if (isDuplicateId) {
            throw new Error(`Erro ao gerar ID único para o carrinho.`);
        }
    
        cart.id = newCartId;
        cart.products = [];
        carts.push(cart);
    
        await this.#saveCarts(carts);
    }
    
    

    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        let cartIds = parseInt(cartId, 10)

        if (!carts || carts.length === 0) {
            throw new Error(`Nenhum carrinho encontrado.`);
        }
        const cart = carts.find(c => c.id === cartIds);
    
        if (!cart) {
            throw new Error(`Carrinho com ID ${cartId} não encontrado.`);
        }
    
        const existingProduct = cart.products.find(p => p.productId === productId);
    
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ productId, quantity: 1 });
        }
    
        await this.#saveCarts(carts);
    }
    

    async getCartById(cartId) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === cartId);

        if (!cart) {
            throw new Error(`Carrinho com ID ${cartId} não encontrado.`);
        }

        return cart.products;
    }


    async nextId(carts) {
        if (!carts || carts.length === 0) {
            return 1;
        }

        let idAnterior = 0;
        carts.forEach(cart => {
            if (cart.id > idAnterior) {
                idAnterior = cart.id;
            }
        });

        idAnterior = idAnterior + 1;
        return idAnterior;
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.#path,'utf-8');
            return JSON.parse(data);
        } catch (err) {
            console.log("Erro ao carregar os dados do arquivo.");
            return [];
        }
    }

    async fileExists() {
        try {
            await fs.access(this.#path);
            return true;
        } catch (err) {
            return false;
        }
    }

    async #saveCarts(listCarts) {
        try {
            await fs.writeFile(this.#path, JSON.stringify(listCarts, null, 2));
            console.log('Carrinho cadastrado com sucesso.');
        } catch (error) {
            console.log('Erro ao gravar carrinho.');
            console.log(error);
        }
    }
}

module.exports = CartManager;
