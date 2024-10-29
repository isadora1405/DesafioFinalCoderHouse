const ChatDTO = require("./../dto/chat.dto.js");
const { factory } = require("./../dao/factory.js");
const logger = require("../utils/logger.js");

const { chatRepository } = factory();

exports.saveMessage = async (req, res) => {
  const { userEmail, message, userName } = req.body;

  if (!userEmail || !message || !userName) {
    logger.warning(
      "Campos obrigatórios ausentes ao tentar salvar uma mensagem."
    );
    return res
      .status(400)
      .json({ error: "User email, user name, and message are required." });
  }

  try {
    await chatRepository.create(new ChatDTO(req.body));
    logger.info(`Mensagem de ${userName} (${userEmail}) salva com sucesso.`);
    res.status(201).json({ message: "Message saved successfully." });
  } catch (error) {
    logger.error(
      `Erro ao salvar a mensagem de ${userName} (${userEmail}): ${error.message}`
    );
    res.status(500).json({ error: "Error saving message: " + error.message });
  }
};
