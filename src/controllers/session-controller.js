const User = require("../dao/models/user.model.js");
const Cart = require("../dao/models/cartsModel.model.js");
const { createHash } = require("../utils.js");
const passport = require("passport");

const ADMIN_EMAIL = "adminCoder@coder.com";
const ADMIN_PASSWORD = "adminCod3r123";

const registerUser = (req, res, next) => {
  passport.authenticate("register", async (err, user, info) => {
    if (err) {
      return res.status(400).send("Erro ao registrar usuário");
    }
    if (!user) {
      return res.redirect("/failregister");
    }
    try {
      const newCart = new Cart({});
      await newCart.save();

      user.cartId = newCart._id;
      await user.save();

      res.render("login", { style: "login.css" });
    } catch (error) {
      return res.status(500).send("Erro ao associar carrinho ao usuário");
    }
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

      req.session.user = {
        name: user.first_name,
        role: role,
        cartId: user.cartId,
        email: user.email,
      };

      req.session.save((err) => {
        if (err) {
          return res.status(400).send("Erro ao salvar a sessão");
        }
        res.cookie("userName", user.first_name, { httpOnly: false });
        res.redirect(user.role === "admin" ? "/realTimeProducts" : "/products");
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

const githubAuth = passport.authenticate("github", { scope: [] });

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
