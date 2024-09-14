const generateMockProduct = require("../mock/product-mock"); // Importando a função de mock

// Controller para gerar e retornar 100 produtos mocks
const getProduct = async (req, resp) => {
  try {
    // Gera uma lista de 100 produtos mocks
    const mockProducts = Array.from({ length: 100 }, () => generateMockProduct());

    // Retorna os produtos no formato JSON
    resp.status(200).json(mockProducts);
  } catch (error) {
    console.error("Erro ao gerar produtos mocks:", error);
    resp.status(500).json({ message: "Erro interno do servidor" });
  }
};

module.exports = {
  getProduct,
};
