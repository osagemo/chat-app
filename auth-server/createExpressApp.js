const express = require("express");
const errorHandler = require("./controllers/errorHandler");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const router = require("./router");
const app = express();

//const corsOptions = {
//  origin: ["http://localhost:3001", "http://192.168.1.96:3001"],
//  optionsSuccessStatus: 200,
//};

module.exports = () => {
  // MiddleWare
  app.use(helmet());
  app.use(
    rateLimit({
      max: 100,
      windowMs: 15 * 60 * 1000,
    })
  );
  app.use(morgan("combined"));
  app.use(bodyParser.json({ type: "*/*" }));
  app.use(cors());
  // Routes
  router(app);

  // Error handling middleware (after routes)
  app.use(errorHandler);

  return app;
};
