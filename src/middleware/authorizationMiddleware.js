const authorizationMiddleware = (requiredRole) => {
  return (req, res, next) => {
    const user = req.session.user;
    console.log("usuário na session", user);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user found in session" });
    }

    // Verifica se o usuário tem a role correta
    if (user.role !== requiredRole) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient privileges" });
    }

    next(); // Usuário autorizado, segue para o próximo middleware
  };
};

module.exports = authorizationMiddleware;
