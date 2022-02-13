const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception, shutting down process");
  logger.error(err);
  process.exit(1);
});

dotenv.config();
const logger = require("./logger")(module);
const app = require("./createExpressApp")();
require("./database/db")(); // initializes knex
const server = app.listen(process.env.SERVER_PORT, function () {
  logger.info(
    `Server started in ${process.env.NODE_ENV} mode, listening on ${process.env.SERVER_IP}:${process.env.SERVER_PORT}`
  );
});

process.on("unhandledRejection", (err, p) => {
  logger.error("Unhandled Rejection, shutting down process");
  logger.error(err);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM recieved. Shutting down process gracefully");
  server.close(() => {
    logger.info("Server closed gracefully");
  });
});
