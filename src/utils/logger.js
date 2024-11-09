const winston = require("winston");
const path = require("path");

const loggerLevels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5,
};

const loggerColors = {
  fatal: "red",
  error: "red",
  warning: "yellow",
  info: "green",
  http: "blue",
  debug: "white",
};

winston.addColors(loggerColors);

const developmentLogger = winston.createLogger({
  levels: loggerLevels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

const productionLogger = winston.createLogger({
  levels: loggerLevels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "error",
      format: winston.format.json(),
    }),
  ],
});

const logger =
  process.env.NODE_ENV === "homol" ? productionLogger : developmentLogger;

module.exports = logger;
