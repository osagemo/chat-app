const { passwordChangedTrigger } = require("../knexfile");

exports.up = function (knex, Promise) {
  let createQuery = `CREATE TABLE users(
    id SERIAL PRIMARY KEY NOT NULL,
    email varchar(100) NOT NULL,
    password text NOT NULL,
    password_changed_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    last_logout_at TIMESTAMPTZ
  );`;
  return knex.raw(createQuery).then(() => knex.raw(passwordChangedTrigger));
};

exports.down = function (knex, Promise) {
  let dropQuery = `DROP TABLE users`;
  return knex.raw(dropQuery);
};
