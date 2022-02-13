const logger = require("../logger")(module);
const passport = require("passport");
const userRepository = require("../repositories/userRepository");
const LocalStrategy = require("passport-local");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");

const localOptions = {
  usernameField: "email",
};

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const localLogin = new LocalStrategy(
  localOptions,
  async (email, password, done) => {
    try {
      const user = await userRepository.getUserByEmail(email);
      if (!user) {
        return done(null, false);
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false);

      logger.info(`successfully authenticated user ${user.email}`);

      const lastLoginAtISO = new Date(Date.now()).toISOString();
      const updatedUser = await userRepository.updateUserById(user.id, {
        last_login_at: lastLoginAtISO,
      });

      return done(null, updatedUser);
    } catch (err) {
      return done(err, false);
    }
  }
);

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const { sub, iat } = payload;
    const user = await userRepository.getUserById(sub);
    if (
      user &&
      timestampAfterDate(iat, user.password_changed_at) &&
      timestampAfterDate(iat, user.last_logout_at)
    ) {
      const lastLoginAtISO = new Date(Date.now()).toISOString();
      const updatedUser = await userRepository.updateUserById(user.id, {
        last_login_at: lastLoginAtISO,
      });

      return done(null, updatedUser);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err, false);
  }
});

function timestampAfterDate(iat, date) {
  if (date) {
    const numericDate = Math.floor(Date.parse(date) / 1000);
    return iat > numericDate;
  }
  return true;
}

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);

module.exports = passport;
