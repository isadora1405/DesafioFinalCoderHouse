const path = require('path');
const fs = require('fs').promises;

class ProductManager {
    #path;

    constructor() {
        const __dirname = path.resolve(); // Obtém o diretório atual
        this.#path = path.join(__dirname, 'src', 'storage', 'product.json'); 
        console.log("caminho", this.#path)
    }

    async addProduct(product) {
        if (await this.productIsValid(product)) {
            const fileExist = await this.fileExists();
            let products = [];

            if (fileExist) {
                try{
                    products = await this.getProduct();
                    if (!product.id) {
                        product.id = await this.nextId();
                    }
                    products.push(product.objectProduct);
                    await this.#salvarProduct(products);
                }catch(error){
                    console.log(error);
                }
            } else {
                if (!product.id) {
                    product.id = await this.nextId();
                }
                products.push(product.objectProduct);
                await this.#salvarProduct(products);
            }
        }
    }

    async updateProduct(id, product) {
        const prod = await this.getProductById(id);

        if (prod) {
            await this.deleteProduct(prod.id);
            product.id = id;
            await this.addProduct(product);
            return;
        }

        console.log("Produto não cadastrado.")
    }

    async deleteProduct(id) {
        const listProd = await this.getProduct();
        const newListProd = listProd.filter(prod => prod.id !== id);
        this.#salvarProduct(newListProd);
    }

    async nextId() {
        const listProd = await this.getProduct();
        if (!listProd || listProd.length === 0) {
            return 1;
        }

        let idAnterior = 0;
        listProd.forEach(prod => {
            if (prod.id > idAnterior) {
                idAnterior = prod.id;
            }
        });

        idAnterior = idAnterior + 1;
        return idAnterior;
    }

    async getProduct() {
        try {
            console.log("path", this.#path)
            const data = await fs.readFile(this.#path,'utf-8');
            return JSON.parse(data);
        } catch (err) {
            console.log("Erro ao carregar os dados do arquivo.")
        }
    }

    async getProductById(id) {
        let product;
        await this.getProduct().then(res => {
            res.find(prod => {
                if (prod.id === id) {
                    console.log("prod", res)
                    product = prod;
                    return product
                }
            });
        });

        if (!product) {
            console.error("Não encontrado.")
        }

        return product;
    }

    async fileExists() {
        try {
            await fs.access(this.#path);
            return true;
        } catch (err) {
            return false;
        }
    }

    async #salvarProduct(listProducts) {
        try{
            await fs.writeFile(this.#path, JSON.stringify(listProducts, null, 2));
            console.log('Produto cadastrado com sucesso.');
        }catch(error){
            console.log(error);
            console.log('Erro ao gravar produto.');
        }
    }

    async hasCode(code) {
        let product;
        await this.getProduct().then(res => {
            res.find(prod => {
                if (prod.code === code) {
                    product = prod;
                    return product
                }
            });
        });

        if (!product) {
            return false
        }

        return true;
    }

    async productIsValid(product) {
        if (product) {
            if (!product.title || product.title.trim().length === 0) {
                console.log("Campo título é obrigatório")
                return false;
            }

            if (!product.description || product.description.trim().length === 0) {
                console.log("Campo descrição é obrigatório")
                return false;
            }
           
            if ((product.price ?? 'sem dados') === 'sem dados') {
                console.log("Campo preço é obrigatório")
                return false;
            } else if (product.price <= 0) {
                console.log("Campo preço deve ser maior que zero.");
                return false;
            }

            if (!product.thumbnail || product.thumbnail.trim().length === 0) {
                console.log("Campo caminho da imagem é obrigatório")
                return false;
            }
            
            if ((product.code ?? 'sem dados') === 'sem dados') {
                console.log("Campo código é obrigatório")
                return false;
            } else if (product.code < 0) {
                console.log("Campo código deve ser maior que zero.");
                return false;
            } else if (await this.hasCode(product.code)) {
                console.log("Código do produto já cadastrado.");
                return false;
            }
            
            if ((product.stock ?? 'sem dados') === 'sem dados') {
                console.log("Campo estoque é obrigatório")
                return false;
            } else if (product.stock < 0) {
                console.log("Campo estoque deve ser maior que zero.");
                return false;
            }
        } else {
            console.log("nenhum produto foi enviado.");
            return false;
        }

        return true;
    }
}

module.exports = ProductManager;