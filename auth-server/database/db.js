const logger = require("../logger")(module);
const knex = require("knex");
const { testConnection, checkUserTable } = require("./util");

const migrationConfig = {
  directory: __dirname + "/migrations",
};

// Initialize knex
const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const db = knex(configuration);

testConnection(db).catch((err) => {
  logger.warn("Not connected to database on startup", err);
});

checkUserTable(db).catch((err) => {
  logger.warn("No user table on startup, attempting migration");
  db.migrate
    .latest(migrationConfig)
    .then(() => logger.info("Migration successful"))
    .catch((err) => {
      // Results in app shutting down
      logger.error("Error while migrating on startup");
      throw err;
    });
});

module.exports = db;
