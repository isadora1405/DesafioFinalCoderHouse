export default class CartDTO {
  
    constructor(cart) {
      this.products = cart.products.map((product) => ({
        productId: product.productId,
        quantity: product.quantity,
      }));
    }
  }
  