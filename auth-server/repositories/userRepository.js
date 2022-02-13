const logger = require("../logger")(module);
const db = require("../database/db");

//let createQuery = `CREATE TABLE users(
//  id SERIAL PRIMARY KEY NOT NULL,
//  email varchar(100) NOT NULL,
//  password varchar(100) NOT NULL,
//  password_changed_at TIMESTAMPTZ,
//  last_login_at TIMESTAMPTZ,
//  last_logout_at TIMESTAMPTZ
//);`;

exports.getUserById = async (id) => {
  const user = await db("users").where("id", Number(id)).first();
  return user;
};

exports.getUserByEmail = async (email) => {
  const user = await db("users").where("email", email).first();
  return user;
};

exports.createUser = async (email, password) => {
  const id = await db("users").returning("id").insert({ email, password });
  return id;
};

exports.updateUserById = async (id, updatedFields) => {
  const user = await db("users")
    .returning("*")
    .where("id", Number(id))
    .update(updatedFields);
  return user.length > 0 ? user[0] : null;
};
