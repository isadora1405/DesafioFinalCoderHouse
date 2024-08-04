const authMiddleware = (req, res, next) => {

    if (req.session.user) {
        return next();
      }
      res.render("login", { style: "login.css" });
  };
  
  module.exports = authMiddleware;