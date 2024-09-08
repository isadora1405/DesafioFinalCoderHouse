const Products = require("../dao/models/productsModel.model.js");
const Repository = require("./repository.js");

class MongoProductRepository extends Repository {
  async getAll() {
    return await Products.find();
  }

  async getById(id) {
    return await Products.findById(id);
  }

  async create(product) {
    const newProduct = new Products(product);
    return await newProduct.save();
  }

  async update(id, product) {
    return await Products.findByIdAndUpdate(id, product, { new: true });
  }

  async delete(id) {
    return await Products.findByIdAndDelete(id);
  }

  async paginate(query, options) {
    return await Products.paginate(query, options);
  }
}

module.exports = MongoProductRepository;
