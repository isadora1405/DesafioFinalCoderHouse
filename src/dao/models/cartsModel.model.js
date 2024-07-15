const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const CartSchema = new mongoose.Schema({
  products: {
    type: [ProductSchema],
    required: true,
  },
});

module.exports = mongoose.model("Cart", CartSchema);
