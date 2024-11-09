const generateProductErrorInfo = (product) => {
  return `One or more product properties were invalid or missing.
  List of required properties:
  * title: needs to be a String, received ${typeof product.title}
  * description: needs to be a String, received ${typeof product.description}
  * code: needs to be a unique String, received ${typeof product.code}
  * price: needs to be a Number, received ${typeof product.price}
  * category: needs to be a String, received ${typeof product.category}
  * stock: needs to be a Number, received ${typeof product.stock}
  * status: needs to be a Boolean, received ${typeof product.status}`;
};

const generateCartNotFoundErrorInfo = (cid) => {
  return `Cart with ID ${cid} was not found. Please check if the cart ID is correct.`;
};

const generateProductNotFoundErrorInfo = (pid) => {
  return `Product with ID ${pid} was not found. Please check if the product ID is correct.`;
};

const generateOutOfStockErrorInfo = (product) => {
  return `The product "${product.title}" (ID: ${product._id}) is out of stock.
  Available stock: ${product.stock}`;
};

const generateServerErrorInfo = (operation, errorMessage) => {
  return `An unexpected error occurred during ${operation}. Error details: ${errorMessage}`;
};

module.exports = {
  generateProductErrorInfo,
  generateCartNotFoundErrorInfo,
  generateProductNotFoundErrorInfo,
  generateOutOfStockErrorInfo,
  generateServerErrorInfo,
};
