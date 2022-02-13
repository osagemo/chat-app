const logger = require("../logger")(module);

module.exports = {
  testConnection(db) {
    return db.raw("select 1+1").then(() => {
      logger.info("Valid database connection.");
    });
  },
  checkUserTable(db) {
    return db
      .raw("select * from users")
      .then(() => {
        logger.info("User table exists.");
      })
      .catch((err) => {
        throw err;
      });
  },
};
