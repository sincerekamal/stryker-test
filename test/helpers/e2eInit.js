const { sequelize } = require("@models");

const { insertUsers } = require("@e2eHelpers");

beforeAll(async () => {
  await sequelize.query(`DELETE from Users WHERE email LIKE 'test%@test.com'`);
  await insertUsers();
});

afterAll(async () => {
  await sequelize.query(`DELETE from Users WHERE email LIKE 'test%@test.com'`);
});
