const { sequelize } = require("@models");
const { users } = require("./testData");
const { generateToken } = require("@middlewares/auth");

const tokensCache = {};
const getToken = async (userType) => {
  const { password, ...user } = users[userType];

  if (!userType) {
    throw new Error(`Invalid user type`);
  }

  if (!tokensCache[userType]) {
    tokensCache[userType] = (await generateToken({ data: user })).token;
  }

  return tokensCache[userType];
};

const getUser = (userType) => {
  return users[userType];
};

const insertUsers = async () => {
  const testUsers = Object.entries(users || {});
  if (testUsers.length) {
    await sequelize.query(`
        INSERT INTO fitness.users (id,email,first_name,password,role_id,status, created_at, updated_at) VALUES
        ${testUsers.map(([_, user]) => {
          return `("${user.id}", "${user.email}", "${user.name}", "${user.password}", "${user.role_id}", "active", now(), now())`;
        })};
    `);
  }
};

const getUserPayload = (name, role_id = 1) => {
  return {
    email: `${name}@test.com`,
    password: "Hello123",
    first_name: name,
    role_id,
  };
};

const createUser = (agent, name, role_id) => {
  return new Promise(async (res) => {
    const adminToken = await getToken("admin");
    const payload = getUserPayload(name, role_id);
    agent
      .post("/v1/users")
      .set({
        Authorization: `Bearer ${adminToken}`,
      })
      .send(getUserPayload(name, role_id))
      .end((err, { body }) => {
        return res(body.data.id);
      });
  });
};

module.exports = {
  getToken,
  getUser,
  insertUsers,
  createUser,
};
