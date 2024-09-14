const ProductDTO = require("./../dto/product.dto.js");
const { faker } = require('@faker-js/faker');

// Função para gerar um mock de um único produto
function generateMockProduct() {
    const product = {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.string.alphanumeric ? faker.string.alphanumeric(8) : faker.random.alphaNumeric(8), // Compatibilidade
        price: faker.commerce.price(),
        category: faker.commerce.department(),
        thumbnail: faker.image.url(), // Função correta para gerar URL de imagem
        stock: faker.number.int ? faker.number.int({ min: 0, max: 100 }) : faker.random.number({ min: 0, max: 100 }), // Compatibilidade
        status: faker.datatype.boolean()
    };

    return new ProductDTO(product);
}

module.exports = generateMockProduct;
