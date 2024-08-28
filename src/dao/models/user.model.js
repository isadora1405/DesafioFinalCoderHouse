const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carts",
  },
  role: { type: String, default: "user" },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
