const User = require("../model/user");
const { createHash } = require("../utils.js");
const passport = require("passport");

const ADMIN_EMAIL = "adminCoder@coder.com";
const ADMIN_PASSWORD = "adminCod3r123";

const registerUser = (req, res, next) => {
  passport.authenticate("register", (err, user, info) => {
    if (err) {
      return res.status(400).send("Erro ao registrar usuário");
    }
    if (!user) {
      return res.redirect("/failregister");
    }
    res.render("login", { style: "login.css" });
  })(req, res, next);
};

const failRegister = async (req, res) => {
  res.send({ erro: "A solicitação falhou" });
};

const loginUser = (req, res, next) => {
  passport.authenticate("login", (err, user, info) => {
    if (err) {
      return res.status(400).send("Erro ao logar usuário");
    }
    if (!user) {
      return res.status(400).send("Credenciais inválidas");
    }
    req.login(user, (err) => {
      if (err) {
        return res.status(400).send("Erro ao logar usuário");
      }

      const role =
        user.email === ADMIN_EMAIL &&
        user.password === createHash(ADMIN_PASSWORD)
          ? "admin"
          : "user";
      req.session.user = { name: user.first_name, role: role };

      req.session.save((err) => {
        if (err) {
          return res.status(400).send("Erro ao salvar a sessão");
        }
        res.cookie("userName", user.first_name, { httpOnly: false });
        res.redirect("/products");
      });
    });
  })(req, res, next);
};

const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      res.redirect("/api/user/login");
    } else {
      res.send({ status: "Logout error", body: err });
    }
  });
};

const githubAuth = passport.authenticate("github", { scope: ["user:email"] });

const githubCallback = (req, res, next) => {
  passport.authenticate(
    "github",
    { failureRedirect: "/login" },
    (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.redirect("/login");

      req.session.user = user;
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
