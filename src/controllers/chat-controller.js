const Chat = require("./../dao/models/chatModel.model");

exports.saveMessage = async (req, res) => {
  const { userEmail, message, userName } = req.body;

  if (!userEmail || !message, !userName) {
    return res.status(400).json({ error: "User and message are required." });
  }

  try {
    const newMessage = new Chat({ userName, message, userEmail });
    await newMessage.save();
    res.status(201).json({ message: "Message saved successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error saving message: " + error.message });
  }
};
