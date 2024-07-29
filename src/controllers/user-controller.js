const User = require("../model/user");

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

module.exports = {
  getLoginPage,
  getRegisterPage,
};
