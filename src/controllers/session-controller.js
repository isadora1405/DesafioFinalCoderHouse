const Cart = require("../dao/models/cartsModel.model.js");
const { createHash } = require("../utils/utils.js");
const passport = require("passport");
const logger = require("../utils/logger.js");
const bcrypt = require("bcrypt");

const { factory } = require("./../dao/factory");
const { userRepository } = factory();

const ADMIN_EMAIL = "adminCoder@coder.com";
const ADMIN_PASSWORD = "adminCod3r123";

const registerUser = (req, res, next) => {
  passport.authenticate("register", async (err, user, info) => {
    if (err) {
      logger.error("Erro ao registrar usuário:", err);
      return res.status(400).send("Erro ao registrar usuário");
    }

    if (!user) {
      logger.warning("Falha ao registrar usuário.");
      return res.status(409).send({ erro: "Email já cadastrado." });
    }
    try {
      if (user.email === ADMIN_EMAIL) {
        user.role = "admin";
        user.password = await bcrypt.hash(ADMIN_PASSWORD, 10);
      } else {
        user.role = "user";
      }
      const newCart = new Cart({});
      await newCart.save();

      user.cartId = newCart._id;
      await user.save();

      logger.info("Usuário registrado com sucesso.");
    } catch (error) {
      logger.error("Erro ao associar carrinho ao usuário:", error);
      return res.status(500).send("Erro ao associar carrinho ao usuário");
    }
  })(req, res, next);
};

const failRegister = async (req, res) => {
  logger.warning("Tentativa de registro falhou.");
  res.send({ erro: "A solicitação falhou" });
};

const loginUser = (req, res, next) => {
  logger.debug("Iniciando processo de login do usuário.");
  passport.authenticate("login", (err, user, info) => {
    if (err) {
      logger.error("Erro ao logar usuário:", err);
      return res.status(400).send("Erro ao logar usuário");
    }
    logger.debug(
      `Resultado da autenticação: ${
        user ? "Usuário encontrado" : "Nenhum usuário encontrado"
      }`
    );

    if (!user) {
      logger.error("Login falhou: credenciais inválidas.");
      return res.status(400).send("Credenciais inválidas");
    }
    req.login(user, (err) => {
      if (err) {
        logger.error("Erro ao logar usuário durante a sessão:", err);
        return res.status(400).send("Erro ao logar usuário");
      }

      logger.debug("Login bem-sucedido. Configurando sessão do usuário.");

      const role =
        user.email === ADMIN_EMAIL &&
        user.password === createHash(ADMIN_PASSWORD)
          ? "admin"
          : "user";
      req.session.user = {
        name: user.first_name,
        lastName: user.last_name,
        age: user.age,
        role: role,
        cartId: user.cartId,
        email: user.email,
      };

      req.session.save((err) => {
        if (err) {
          logger.error("Erro ao salvar a sessão do usuário:", err);
          return res.status(400).send("Erro ao salvar a sessão");
        }

        user.last_accessed = new Date();
        userRepository.update(user._id, user);
        logger.info("Usuário logado com sucesso.");
        res.cookie("userName", user.first_name, { httpOnly: false });
        res.redirect(user.role === "admin" ? "/realTimeProducts" : "/products");
      });
    });
  })(req, res, next);
};

const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      logger.info("Usuário deslogado com sucesso.");
      res.redirect("/api/user/login");
    } else {
      logger.error("Erro ao deslogar usuário:", err);
      res.send({ status: "Logout error", body: err });
    }
  });
};

const githubAuth = passport.authenticate("github", { scope: [] });

const githubCallback = (req, res, next) => {
  passport.authenticate(
    "github",
    { failureRedirect: "/login" },
    (err, user, info) => {
      if (err) {
        logger.error("Erro na autenticação GitHub:", err);
        return next(err);
      }
      if (!user) {
        logger.warning("Falha na autenticação GitHub: usuário não encontrado.");
        return res.redirect("/login");
      }

      req.session.user = user;
      logger.info("Usuário autenticado com sucesso via GitHub.");
      res.redirect("/products");
    }
  )(req, res, next);
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  failRegister,
  githubAuth,
  githubCallback,
};
