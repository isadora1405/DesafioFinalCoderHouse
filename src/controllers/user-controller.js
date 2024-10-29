const UserDTO = require("../dto/user.dto");
const logger = require("./../utils/logger.js");

const getLoginPage = (req, res) => {
  if (req.session.user) {
    logger.info("Usuário já logado, redirecionando para a página de produtos.");
    return res.redirect("/products");
  }
  logger.info("Renderizando a página de login.");
  res.render("login", { style: "login.css" });
};

const getRegisterPage = (req, res) => {
  if (req.session.user) {
    logger.info("Usuário já logado, redirecionando para a página de produtos.");
    return res.redirect("/products");
  }
  logger.info("Renderizando a página de registro.");
  res.render("register", { style: "register.css" });
};

const getCurrentUser = (req, res) => {
  if (req.session.user) {
    const userDTO = new UserDTO(req.session.user);
    logger.info("Retornando informações do usuário logado.");
    return res.json(userDTO);
  } else {
    logger.warning(
      "Tentativa de acesso a informações do usuário sem autenticação."
    );
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = {
  getLoginPage,
  getRegisterPage,
  getCurrentUser,
};
