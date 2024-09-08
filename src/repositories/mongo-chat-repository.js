const Chat = require("../dao/models/chatModel.model.js");
const Repository = require("./repository.js");

class MongoChatRepository extends Repository {
  async getAll() {
    return await Chat.find();
  }

  async getById(id) {
    return await Chat.findById(id);
  }

  async create(product) {
    const newProduct = new Chat(product);
    return await newProduct.save();
  }

  async update(id, product) {
    return await Chat.findByIdAndUpdate(id, product, { new: true });
  }

  async delete(id) {
    return await Chat.findByIdAndDelete(id);
  }

  async paginate(query, options) {
    return await Chat.paginate(query, options);
  }
}

module.exports = MongoChatRepository;
