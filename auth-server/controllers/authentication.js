const logger = require("../logger")(module);
const bcrypt = require("bcrypt");
const redis = require("../database/redis");
const userRepository = require("../repositories/userRepository");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const jwt = require("jsonwebtoken");

const tokenForUser = (userId) => {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = await bcrypt.hash(req.body.password, 10);

  if (await userRepository.getUserByEmail(email))
    return next(new AppError("Email is in use", 422));

  const userId = await userRepository.createUser(email, password);

  res.json({ token: tokenForUser(userId) });
});

exports.signin = catchAsync(async (req, res, next) => {
  // already authenticated by middleware, give user token
  logger.info(`User ${req.user.id} signed in`);
  res.json({ token: tokenForUser(req.user.id) });
});

exports.signout = catchAsync(async (req, res, next) => {
  const lastLogoutAtISO = new Date(Date.now()).toISOString();
  const updatedUser = await userRepository.updateUserById(req.user.id, {
    last_logout_at: lastLogoutAtISO,
  });

  logger.info(
    `User ${updatedUser.id} signed out, last_logout: ${updatedUser.last_logout_at}`
  );
  res.json({ sucess: true });
});

exports.wsticket = catchAsync(async (req, res, next) => {
  const ticketData = {
    ip: req.socket.remoteAddress,
    issuedAt: new Date().toISOString(),
    issuedFor: req.user.email,
  };

  logger.info(`ticket issued for user ${req.user.email}`);
  const ticket = crypto.randomUUID();

  await redis.set(ticket, JSON.stringify(ticketData));
  res.json({ ticket });
});
