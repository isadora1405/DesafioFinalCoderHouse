const generateMockProduct = require("../mock/product-mock");
const logger = require("../utils/logger.js");

const getProduct = async (req, resp) => {
  try {
    const mockProducts = Array.from({ length: 100 }, () =>
      generateMockProduct()
    );
    logger.info("100 produtos mocks gerados com sucesso.");
    resp.status(200).json(mockProducts);
  } catch (error) {
    logger.error("Erro ao gerar produtos mocks:", error);
    resp.status(500).json({ message: "Erro interno do servidor" });
  }
};

module.exports = {
  getProduct,
};
