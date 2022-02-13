module.exports = {
  local: {
    client: "pg",
    connection: process.env.LOCAL_DB_URI,
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds/dev",
    },
    useNullAsDefault: true,
  },

  development: {
    client: "pg",
    connection: process.env.DB_URI,
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds/dev",
    },
    useNullAsDefault: true,
  },

  test: {
    client: "pg",
    connection: process.env.DB_URI,
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds/test",
    },
    useNullAsDefault: true,
  },

  production: {
    client: "pg",
    connection: process.env.DB_URI,
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds/production",
    },
    useNullAsDefault: true,
  },

  passwordChangedTrigger: `
    CREATE TRIGGER password_changed
    BEFORE UPDATE ON users
    FOR EACH ROW
    WHEN (OLD.password IS DISTINCT FROM NEW.password)
    EXECUTE FUNCTION update_password_timestamp();
  `,
};
