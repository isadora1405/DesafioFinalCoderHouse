//const { json } = require("express");
const Products = require("./../dao/models/productsModel.model");


const ProductDTO = require("./../dto/product.dto.js");
const { factory } = require("./../dao/factory.js");

const { productRepository } = factory();

const getProduct = async (req, resp) => {
  const query = definirQuery(req.query);

  const options = {
    page: req.query.page ? parseInt(req.query.page) : 1,
    limit: req.query.limit ? parseInt(req.query.limit) : 10,
    sort: req.query.sort ? { price: definirOrdem(req.query.sort) } : {} // Ordenação por preço
  };

  try {
    const listProducts = await productRepository.paginate(query, options);
    listProducts.status = "sucesso";
    listProducts.payload = listProducts.docs;
    delete listProducts.docs;

    resp.status(200).json(listProducts);
  } catch (error) {
    resp.status(500).json({ error: error.message });
  }
};

function definirQuery(query) {
  const { category, disponibilidade }  = query;
  let dados = {};
  if (category) {
    dados.category = category
  }
  
  if (disponibilidade) {
    dados.status = disponibilidade;
  }

  return dados;
}

function definirOrdem(valor) {
  if (valor === 'desc') {
    return -1;
  }

  return 1;
}

const getProductById = async (req, res) => {
  try {
    const product = await productRepository.getById(req.params.pid);
    if (!product) {
      return res.status(404).send({ error: "Produto não encontrado" });
    }
    res.send(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const newProductDTO = new ProductDTO(req.body); // Cria um DTO a partir do corpo da requisição
    await productRepository.create(newProductDTO);  // Passa o DTO para o repositório
    res.status(201).json({ mensagem: "Produto salvo com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  let { pid } = req.params;
  let productsToReplaceDTO = new ProductDTO(req.body); // Cria um DTO para os dados atualizados

  try {
    let result = await productRepository.update(pid, productsToReplaceDTO);
    res.send({ status: "Produto atualizado com sucesso!", payload: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  let { pid } = req.params;
  try {
    const product = await productRepository.delete(pid);
    if (!product) {
      return res.status(404).json({ success: false, msg: "Produto não encontrado" });
    }
    res.json({ success: true });
  } catch (error) {
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
