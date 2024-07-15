const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    trim: true,
    match: /.+\@.+\..+/,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Chat = mongoose.model("Message", messagesSchema);

module.exports = Chat;
