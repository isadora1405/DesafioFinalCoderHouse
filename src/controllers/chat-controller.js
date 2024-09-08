const ChatDTO = require("./../dto/chat.dto.js");
const { factory } = require("./../dao/factory.js");

const { chatRepository } = factory();

exports.saveMessage = async (req, res) => {
  const { userEmail, message, userName } = req.body;

  if (!userEmail || !message, !userName) {
    return res.status(400).json({ error: "User and message are required." });
  }

  try {
    await chatRepository.create(new ChatDTO(req.body))
    res.status(201).json({ message: "Message saved successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error saving message: " + error.message });
  }
};
