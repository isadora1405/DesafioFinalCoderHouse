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

const getCurrentUser = (req, res) => {
  if (req.session.user) {
    const userDTO = new UserDTO(req.session.user);
    return res.json(userDTO);
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = {
  getLoginPage,
  getRegisterPage,
  getCurrentUser,
};
