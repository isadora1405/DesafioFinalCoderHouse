const ProductDTO = require("./../dto/product.dto.js");
const { factory } = require("./../dao/factory.js");
const CustomError = require("../services/errors/customErrors.js");
const {
  generateServerErrorInfo,
  generateProductErrorInfo,
} = require("../services/errors/info.js");
const logger = require("./../utils/logger.js");

const { productRepository } = factory();

const getProduct = async (req, resp) => {
  const query = definirQuery(req.query);
  const options = {
    page: req.query.page ? parseInt(req.query.page) : 1,
    limit: req.query.limit ? parseInt(req.query.limit) : 10,
    sort: req.query.sort ? { price: definirOrdem(req.query.sort) } : {},
  };

  try {
    const listProducts = await productRepository.paginate(query, options);
    listProducts.status = "sucesso";
    listProducts.payload = listProducts.docs;
    delete listProducts.docs;

    logger.info("Produtos buscados com sucesso com paginação.");
    resp.status(200).json(listProducts);
  } catch (error) {
    logger.error("Erro ao buscar produtos com paginação:", error);
    resp.status(500).json({ error: error.message });
  }
};

function definirQuery(query) {
  const { category, disponibilidade } = query;
  let dados = {};
  if (category) {
    dados.category = category;
  }

  if (disponibilidade) {
    dados.status = disponibilidade;
  }

  return dados;
}

function definirOrdem(valor) {
  if (valor === "desc") {
    return -1;
  }

  return 1;
}

const getProductById = async (req, res) => {
  try {
    const product = await productRepository.getById(req.params.pid);
    if (!product) {
      logger.warning(`Produto com ID ${req.params.pid} não encontrado.`);
      return res.status(404).send({ error: "Produto não encontrado" });
    }
    logger.info(`Produto com ID ${req.params.pid} encontrado.`);
    res.send(product);
  } catch (error) {
    logger.error(`Erro ao buscar produto por ID ${req.params.pid}:`, error);
    res.status(400).json({ error: error.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const { title, description, code, price, category } = req.body;

    if (!title || !description || !code || !price || !category) {
      logger.warning("Campos obrigatórios ausentes ao criar produto.");
      throw CustomError.createError({
        name: "Product creation error",
        cause: generateProductErrorInfo(req.body),
        message: "Error creating product: missing required fields",
        code: EErrors.MISSING_FIELDS,
      });
    }

    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof code !== "string" ||
      typeof price !== "number" ||
      typeof category !== "string"
    ) {
      CustomError.createError({
        name: "Product creation error",
        cause: generateProductErrorInfo(req.body),
        message: "Error creating product: invalid field types",
        code: EErrors.INVALID_TYPES,
      });
    }
    const newProductDTO = new ProductDTO(req.body);
    await productRepository.create(newProductDTO);
    logger.info("Produto criado com sucesso.");
    res.status(201).json({ mensagem: "Produto salvo com sucesso!" });
  } catch (error) {
    logger.error("Erro ao adicionar produto:", error);
    CustomError.createError({
      name: "Server Error",
      message: error.message,
      cause: generateServerErrorInfo("Adding product", error.message),
      code: EErrors.SERVER_ERROR,
    });
  }
};

const updateProduct = async (req, res) => {
  let { pid } = req.params;
  let productsToReplaceDTO = new ProductDTO(req.body);

  try {
    let result = await productRepository.update(pid, productsToReplaceDTO);
    logger.info(`Produto com ID ${pid} atualizado com sucesso.`);
    res.send({ status: "Produto atualizado com sucesso!", payload: result });
  } catch (error) {
    logger.error(`Erro ao atualizar produto com ID ${pid}:`, error);
    res.status(400).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  let { pid } = req.params;
  try {
    const product = await productRepository.delete(pid);
    if (!product) {
      logger.warning(`Produto com ID ${pid} não encontrado para exclusão.`);
      return res
        .status(404)
        .json({ success: false, msg: "Produto não encontrado" });
    }
    logger.info(`Produto com ID ${pid} excluído com sucesso.`);
    res.json({ success: true });
  } catch (error) {
    logger.error(`Erro ao excluir produto com ID ${pid}:`, error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getProduct,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
