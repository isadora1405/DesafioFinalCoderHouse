const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  age: { type: Number, required: false },
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carts",
  },
  role: { type: String, default: "user" },
  last_accessed: { 
    type: Date, 
    default: new Date('2024-11-04T03:00:00.000Z')
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
