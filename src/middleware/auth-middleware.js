const authMiddleware = (req, res, next) => {
  if (!req.session.user) {
    if (req.xhr || req.headers.accept.indexOf("json") > -1) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user found in session" });
    } else {
      return res.redirect("/login");
    }
  }

  next();
};

module.exports = authMiddleware;
