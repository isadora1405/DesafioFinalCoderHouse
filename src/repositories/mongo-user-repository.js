const User = require("../dao/models/user.model.js");
const Repository = require("./repository.js");

class MongoUserRepository extends Repository {
  async getAll() {
    return await User.find();
  }

  async getById(id) {
    return await User.findById(id);
  }

  async create(product) {
    const newProduct = new Products(product);
    return await newProduct.save();
  }

  async update(id, user) {
    return await User.findByIdAndUpdate(id, user, { new: true });
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }

  async paginate(query, options) {
    return await User.paginate(query, options);
  }

  
}

module.exports = MongoUserRepository;
