const redis = require("redis");
const logger = require("../logger")(module);

let redisClient;

(async () => {
  let db = process.env.REDIS_DATABASE;
  let password = process.env.REDIS_PASSWORD;
  let address = process.env.REDIS_ADDRESS;
  const addressParts = address.split(":");

  redisClient = redis.createClient({
    password,
    socket: {
      host: addressParts[0],
      port: addressParts[1],
    },
  });

  redisClient.on("error", (error) => logger.error(`Error : ${error}`));

  await redisClient.connect();
})();

module.exports = redisClient;
