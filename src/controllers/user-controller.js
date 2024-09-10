const User = require("../dao/models/user.model");
const UserDTO = require("../dto/user.dto");

const getLoginPage = (req, res) => {
  if (req.session.user) {
    return res.redirect("/products");
  }
  res.render("login", { style: "login.css" });
};

const getRegisterPage = (req, res) => {
  if (req.session.user) {
    return res.redirect("/products");
  }
  res.render("register", { style: "register.css" });
};

// Função para obter o usuário atual
const getCurrentUser = (req, res) => {
  if (req.user) {
    const userDTO = new UserDTO(req.user); // Converte o usuário em um DTO
    return res.json(userDTO); // Envia as informações necessárias
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = {
  getCurrentUser,
};

module.exports = {
  getLoginPage,
  getRegisterPage,
  getCurrentUser,
};
