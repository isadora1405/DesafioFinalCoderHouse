const Carts = require("../dao/models/cartsModel.model");
const Products = require("./../dao/models/productsModel.model");
const TicketService = require("./../services/ticketService.js");
const CustomError = require("../services/errors/customErrors.js");
const EErrors = require("./../services/errors/enums.js");
const {
  generateCartNotFoundErrorInfo,
  generateProductNotFoundErrorInfo,
  generateOutOfStockErrorInfo,
  generateServerErrorInfo,
} = require("../services/errors/info.js");
const logger = require("../utils/logger.js");

const { factory } = require("./../dao/factory");
const CartDTO = require("./../dto/cart.dto");

const { cartsRepository } = factory();
const { productRepository } = factory();
const { ticketRepository } = factory();

const getCarts = async (req, res) => {
  try {
    const carts = await cartsRepository.getAll();
    logger.info("Carrinhos recuperados com sucesso.");
    res.status(200).json(carts);
  } catch (error) {
    logger.error(`Erro ao recuperar carrinhos: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

const getCartById = async (req, res) => {
  try {
    const cart = await cartsRepository.getById(req.params.cid);
    if (!cart) {
      logger.warning(`Carrinho ${req.params.cid} não encontrado.`);
      return res.status(404).json({ error: "Carrinho não encontrado" });
    }
    logger.info(`Carrinho ${req.params.cid} recuperado com sucesso.`);
    res.status(200).json(cart);
  } catch (error) {
    logger.error(
      `Erro ao recuperar carrinho ${req.params.cid}: ${error.message}`
    );
    res.status(400).json({ error: error.message });
  }
};

const addNewCart = async (req, res) => {
  try {
    const newCartDTO = new CartDTO(req.body);
    await cartsRepository.create(newCartDTO);
    logger.info("Novo carrinho criado com sucesso.");
    res.send({ result: "success", payload: newCartDTO });
  } catch (error) {
    logger.error(`Erro ao criar novo carrinho: ${error.message}`);
    res.status(500).send("Erro no servidor");
  }
};

const deleteAllProductsFromCart = async (req, res) => {
  try {
    const result = await cartsRepository.clearCartProducts(req.params.cid);
    if (!result.modifiedCount) {
      logger.warning(`Carrinho ${req.params.cid} não encontrado para limpeza.`);
      return res
        .status(404)
        .json({ success: false, msg: "Carrinho não encontrado" });
    }
    logger.info(`Produtos removidos do carrinho ${req.params.cid}.`);
    res
      .status(200)
      .json({ success: true, msg: "Produtos removidos do carrinho." });
  } catch (error) {
    logger.error(
      `Erro ao remover produtos do carrinho ${req.params.cid}: ${error.message}`
    );
    res.status(500).json({ success: false, error: error.message });
  }
};

const getMyCart = async (req, res) => {
  const { user } = req;

  if (!user || !user.cartId) {
    logger.warning("Usuário sem carrinho ao tentar acessar o carrinho.");
    return res.status(400).json({ error: "Usuário não possui carrinho" });
  }

  try {
    logger.info(`Recuperando carrinho do usuário ${user.cartId}.`);
    await getCartById({ params: { cid: user.cartId } }, res);
  } catch (error) {
    logger.error(
      `Erro ao recuperar carrinho do usuário ${user.cartId}: ${error.message}`
    );
    res.status(500).json({ error: "Erro ao recuperar o carrinho" });
  }
};

const addNewProductToMyCart = async (req, res) => {
  const { user } = req;
  if (!user || !user.cartId) {
    logger.warning("Usuário sem carrinho ao tentar adicionar produto.");
    return res.status(400).send("Usuário não possui carrinho");
  }
  await addNewProductToCart(
    { params: { cid: user.cartId, pid: req.params.pid } },
    res
  );
};

const addNewProductToCart = async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await cartsRepository.getById(cid);
    if (!cart) {
      CustomError.createError({
        name: "Cart Error",
        message: "Carrinho não encontrado",
        cause: generateCartNotFoundErrorInfo(cid),
        code: EErrors.CART_NOT_FOUND,
      });
      logger.warning(`Carrinho ${cid} não encontrado para adicionar produto.`);
      return res.status(404).json({ error: "Carrinho não encontrado" });
    }

    const product = await Products.findById(pid);
    if (!product) {
      CustomError.createError({
        name: "Product Error",
        message: "Produto não encontrado",
        cause: generateProductNotFoundErrorInfo(pid),
        code: EErrors.PRODUCT_NOT_FOUND,
      });
      logger.warning(
        `Produto ${pid} não encontrado para adição ao carrinho ${cid}.`
      );
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    const existingProduct = cart.products.find((p) => p.productId.equals(pid));

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ productId: pid, quantity: 1 });
    }

    if (product.stock <= 0) {
      CustomError.createError({
        name: "Stock Error",
        message: "Estoque insuficiente",
        cause: generateOutOfStockErrorInfo(product),
        code: EErrors.OUT_OF_STOCK,
      });
      logger.warning(
        `Produto ${pid} sem estoque para adição ao carrinho ${cid}.`
      );
      return res.status(400).json({ error: "Estoque insuficiente" });
    }

    await cart.save();
    logger.info(`Produto ${pid} adicionado ao carrinho ${cid}.`);
    res.json({
      message: "Produto adicionado ao carrinho com sucesso",
      payload: cart,
    });
  } catch (error) {
    CustomError.createError({
      name: "Server Error",
      message: error.message,
      cause: generateServerErrorInfo("adding product to cart", error.message),
      code: EErrors.SERVER_ERROR,
    });
    logger.error(
      `Erro ao adicionar produto ${pid} ao carrinho ${cid}: ${error.message}`
    );
    res.status(500).json("Erro no servidor");
  }
};

const updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    const cart = await Carts.findById(cid);
    if (!cart) {
      logger.warning(`Carrinho ${cid} não encontrado para atualização.`);
      return res.status(404).send({ error: "Carrinho não encontrado" });
    }

    const productIds = products.map((p) => p.productId);
    const existingProducts = await Products.find({ _id: { $in: productIds } });
    const existingProductIds = existingProducts.map((p) => p._id.toString());

    const validProducts = products.filter((p) =>
      existingProductIds.includes(p.productId.toString())
    );

    cart.products = validProducts;
    await cart.save();

    logger.info(`Carrinho ${cid} atualizado com novos produtos.`);
    const updatedCart = await Carts.findById(cid).populate(
      "products.productId"
    );
    res.send({ result: "success", payload: updatedCart });
  } catch (error) {
    logger.error(`Erro ao atualizar carrinho ${cid}: ${error.message}`);
    res.status(500).send("Erro no servidor");
  }
};

const updateProductQuantityInCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== "number" || quantity < 0) {
      logger.warning(
        `Quantidade inválida fornecida para o produto ${pid} no carrinho ${cid}`
      );
      return res.status(400).send({ error: "Quantidade inválida fornecida" });
    }

    const cart = await Carts.findById(cid);
    if (!cart) {
      logger.warning(
        `Carrinho ${cid} não encontrado para atualização de quantidade.`
      );
      return res.status(404).json({ error: "Carrinho não encontrado" });
    }

    const product = await Products.findById(pid);
    if (!product) {
      logger.warning(
        `Produto ${pid} não encontrado para atualização de quantidade no carrinho ${cid}`
      );
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === pid
    );
    if (productIndex === -1) {
      logger.warning(`Produto ${pid} não encontrado no carrinho ${cid}`);
      return res
        .status(404)
        .json({ error: "Produto não encontrado no carrinho" });
    }

    cart.products[productIndex].quantity = quantity;
    await cart.save();

    logger.info(
      `Quantidade do produto ${pid} no carrinho ${cid} atualizada para ${quantity}`
    );
    const updatedCart = await Carts.findById(cid).populate(
      "products.productId"
    );
    res.json({ result: "success", payload: updatedCart });
  } catch (error) {
    logger.error(
      `Erro ao atualizar quantidade no carrinho ${cid}: ${error.message}`
    );
    res.status(500).json("Erro no servidor");
  }
};

const finalizePurchase = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartsRepository.getById(cid);

    if (!cart) {
      logger.warning(
        `Carrinho ${cid} não encontrado na finalização da compra.`
      );
      return res.status(404).json({ message: "Carrinho não encontrado" });
    }

    let totalAmount = 0;
    const unavailableProducts = [];

    for (let item of cart.products) {
      const product = await productRepository.getById(item.productId);

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await productRepository.update(product._id, { stock: product.stock });
        totalAmount += product.price * item.quantity;
      } else {
        unavailableProducts.push(item.productId);
      }
    }

    if (totalAmount > 0) {
      const ticketData = {
        amount: totalAmount,
        purchaser: req.session.user.email,
        cartId: cid,
      };
      const response = await ticketRepository.createTicket(ticketData);

      if (response) {
        cart.products = cart.products.filter((item) =>
          unavailableProducts.includes(item.productId)
        );
        await cartsRepository.update(cart._id, { products: cart.products });

        logger.info("Compra concluída com sucesso.");
        return res.json({
          message: "Compra concluída com sucesso",
          unavailableProducts,
        });
      } else {
        logger.error("Erro ao criar o ticket.");
        return res.status(500).json({ message: "Erro ao criar o ticket" });
      }
    }

    res.json({
      message: "Nenhum item foi comprado",
      unavailableProducts,
    });
  } catch (error) {
    logger.error(`Erro ao finalizar a compra: ${error.message}`);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

function generateUniqueCode() {
  return "TICKET-" + Math.random().toString(36).substring(2, 9).toUpperCase();
}

module.exports = {
  addNewCart,
  addNewProductToCart,
  addNewProductToMyCart,
  getCartById,
  getCarts,
  getMyCart,
  deleteAllProductsFromCart,
  updateCart,
  updateProductQuantityInCart,
  finalizePurchase,
};
