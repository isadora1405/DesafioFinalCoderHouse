const logger = require("../../utils/logger.js");
class CustomError {
  static createError({ name = "Error", cause, message, code = 500 }) {
    const error = new Error(message, { cause });
    error.name = name;
    error.code = code;
    logger.error(`[${name}] ${message}. Cause: ${cause}`);
    return error;
  }
}

module.exports = CustomError;
