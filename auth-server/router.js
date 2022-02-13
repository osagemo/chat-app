const Authentication = require("./controllers/authentication");
const passportService = require("./services/passport");
const AppError = require("./utils/appError");

const requireAuth = passportService.authenticate("jwt", { session: false });
const requireSignin = passportService.authenticate("local", { session: false });

module.exports = function (app) {
  app.get("/", requireAuth, (req, res) => {
    res.send("Hello there");
  });
  app.post("/signup", Authentication.signup);
  app.post("/signin", requireSignin, Authentication.signin);
  app.post("/signout", requireAuth, Authentication.signout);
  app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`), 404);
  });
};
