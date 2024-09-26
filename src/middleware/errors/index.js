const EErrors = require("../../services/errors/enums");

const errorHandler = (error, req, res, next) => {
  console.error(error.cause);

  const errorType = Object.values(EErrors).find((e) => e.code === error.code);
  const statusCode = errorType ? errorType.status : 500;
  res.status(statusCode).send({
    status: "Error",
    message: error.message,
    details: error.cause || "Unhandled error",
  });
};

module.exports = errorHandler;
