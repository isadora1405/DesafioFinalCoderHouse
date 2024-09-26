const authorizationMiddleware = (requiredRole) => {
  return (req, res, next) => {
    const user = req.session.user;

    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user found in session" });
    }

    if (user.role !== requiredRole) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient privileges" });
    }

    next();
  };
};

module.exports = authorizationMiddleware;
