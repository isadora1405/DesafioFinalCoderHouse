const Carts = require("../dao/models/cartsModel.model.js");

class MongoCartsRepository {
  async getAll() {
    return await Carts.find();
  }

  async getById(id) {
    return await Carts.findById(id).populate("products.productId");
  }

  async create(cartDTO) {
    const cart = new Carts(cartDTO);
    return await cart.save();
  }

  async update(id, cartDTO) {
    return await Carts.updateOne({ _id: id }, cartDTO);
  }

  async delete(id) {
    return await Carts.deleteOne({ _id: id });
  }

  async clearCartProducts(id) {
    return await Carts.updateOne({ _id: id }, { $set: { products: [] } });
  }
}

module.exports = MongoCartsRepository;
