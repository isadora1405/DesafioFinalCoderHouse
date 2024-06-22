const path = require('path');
const fs = require('fs').promises;

class ProductManager {
    #path;
    #messageErro;

    constructor() {
        const __dirname = path.resolve(); // Obtém o diretório atual
        this.#path = path.join(__dirname, 'src', 'storage', 'product.json'); 
        this.#messageErro = "";
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
                        product = this.status(product);
                    }
                    products.push(product);
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
        } else {
            throw new Error(this.#messageErro);
        }   
    }

    status(product) {
        if (!product.status) {
            product.status = true;
        }

        return product
    }

    async updateProduct(id, product) {
        if (!id) {
            throw new Error(`Para atualizar um produto deve ser enviado o id`);
        }

        const prod = await this.getProductById(id);

        if (prod) {
            await this.deleteProduct(prod.id);
            let update = {...prod, ...product}
            update.id = id;
            await this.addProduct(update);
            return;
        } else {
            throw new Error(`Produto com id ${id} não cadastrado.`);
        }
    }

    async deleteProduct(id) {
        const listProd = await this.getProduct();
        const prodDelete = listProd.find( prod => prod.id === id);

        if (!prodDelete) {
            throw new Error(`Produto com id ${id} não cadastrado.`);
        }

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
                this.#messageErro = "Campo título é obrigatório";
                return false;
            }

            if (!product.description || product.description.trim().length === 0) {
                this.#messageErro = "Campo descrição é obrigatório";
                return false;
            }

            if (!product.category || product.category.trim().length === 0) {
                this.#messageErro = "Campo categoria é obrigatório";
                return false;
            }
           
            if ((product.price ?? 'sem dados') === 'sem dados') {
                this.#messageErro = "Campo preço é obrigatório";
                return false;
            } else if (product.price <= 0) {
                this.#messageErro = "Campo preço deve ser maior que zero.";
                return false;
            }

            if (!product.thumbnail || product.thumbnail.trim().length === 0) {
                this.#messageErro = "Campo caminho da imagem é obrigatório";
                return false;
            }
            
            if ((product.code ?? 'sem dados') === 'sem dados') {
                this.#messageErro = "Campo código é obrigatório";
                return false;
            } else if (product.code < 0) {
                this.#messageErro = "Campo código deve ser maior que zero.";
                return false;
            } else if (await this.hasCode(product.code)) {
                this.#messageErro = "Código do produto já cadastrado.";
                return false;
            }
            
            if ((product.stock ?? 'sem dados') === 'sem dados') {
                this.#messageErro = "Campo estoque é obrigatório";
                return false;
            } else if (product.stock < 0) {
                this.#messageErro = "Campo estoque deve ser maior que zero.";
                return false;
            }
        } else {
            this.#messageErro = "nenhum produto foi enviado.";
            return false;
        }

        return true;
    }
}

module.exports = ProductManager;