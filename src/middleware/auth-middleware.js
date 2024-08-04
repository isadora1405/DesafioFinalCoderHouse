const authMiddleware = (req, res, next) => {

    if (req.session.user) {
        // Se o usuário está autenticado, continue
        return next();
      }
      const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  console.log("URL chamada:", fullUrl);
  
      // Se o usuário não está autenticado, redirecione para a página de login
      res.render("login", { style: "login.css" });
      //res.redirect("/api/user/login");
  };
  
  module.exports = authMiddleware;