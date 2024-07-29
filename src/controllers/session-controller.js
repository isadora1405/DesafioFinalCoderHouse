const User = require("../model/user");

const ADMIN_EMAIL = "adminCoder@coder.com";
const ADMIN_PASSWORD = "adminCod3r123";

const registerUser = async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  try {
    const user = new User({ first_name, last_name, email, age, password });
    await user.save();
    res.redirect("/login");
  } catch (err) {
    res.status(400).send("Erro ao registrar usuário");
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).send("Credenciais inválidas");
    }

    const role =
      email === ADMIN_EMAIL && password === ADMIN_PASSWORD ? "admin" : "user";
    req.session.user = { name: user.first_name, role: role };

    await req.session.save();
    res.redirect("/products");
  } catch (err) {
    res.status(400).send("Erro ao logar usuário");
  }
};

const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      res.redirect("/login");
    } else {
      res.send({ status: "Logout error", body: err });
    }
  });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
