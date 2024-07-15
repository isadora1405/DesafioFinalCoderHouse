const Products = require("./../dao/models/productsModel.model");

const getProduct = async (req, resp) => {
  const limit = req.query.limit;

  try {
    const listProducts = await Products.find();
    if (limit && listProducts.length && listProducts.length > limit) {
      resp.send(listProducts.slice(0, limit));
      return;
    }

    resp.send(listProducts);
  } catch (error) {
    resp.status(500).json({ error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Products.findById(req.params.pid);
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
    const newProducts = new Products(req.body);
    await newProducts.save();
    res.status(201).json({ mensagem: "Dados salvo com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  let { pid } = req.params;
  let productsToReplace = req.body;

  try {
    let result = await Products.updateOne({ _id: pid }, productsToReplace);
    res.send({ status: "Produto atualizado com sucesso!", payload: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  let { pid } = req.params;
  try {
    const product = await Products.deleteOne({ _id: pid });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, msg: "Produto não encontrado" });
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
