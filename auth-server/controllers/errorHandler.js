const logger = require("../logger")(module);
const AppError = require("../utils/appError");

const sendErrorDev = (err, req, res) => {
  if (!err.isOperational) {
    logger.error(err);
  }
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
    });
  }
  // Should it shutdown here? App state is uncertain
  // This includes any error thrown by any dependencies as they are not appErrors
  logger.error("Programmatic Error ", err);
  return res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    logger.error(`Error type: ${err.name}`);
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    logger.error(`Error type: ${err.name}`);
    sendErrorProd(err, req, res);
  }
};
