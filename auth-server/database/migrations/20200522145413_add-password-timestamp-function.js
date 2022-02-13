const UPDATE_PASSWORD_TIMESTAMP_FUNCTION = `
CREATE OR REPLACE FUNCTION update_password_timestamp()
  RETURNS trigger AS $$
  BEGIN
    NEW.password_changed_at = now();
    RETURN NEW;
  END;
$$ language 'plpgsql';
`;

const DROP_UPDATE_PASSWORD_TIMESTAMP_FUNCTION = `DROP FUNCTION update_password_timestamp`;

exports.up = function (knex) {
  return knex.raw(UPDATE_PASSWORD_TIMESTAMP_FUNCTION);
};

exports.down = function (knex) {
  return knex.raw(DROP_UPDATE_PASSWORD_TIMESTAMP_FUNCTION);
};
