const app = require("@server");
const supertest = require("supertest");
const { getToken } = require("@e2eHelpers");

describe(`Users > `, () => {
  let adminToken, managerToken, normalToken;

  beforeAll(async () => {
    adminToken = await getToken("admin");
    managerToken = await getToken("manager");
    normalToken = await getToken("normal");
  });

  const agent = supertest(app);
  const ENDPOINT = "/v1/users";

  describe(`create > `, () => {
    describe(`common >`, () => {
      it(`should throw auth error if token is not provided`, (done) => {
        agent
          .post(ENDPOINT)
          .send({
            // empty body
          })
          .expect(401)
          .end((err, res) => {
            expect(res.body.data).toBe(null);
            expect(res.body.result.message).toBe(`jwt must be provided`);
            expect(res.body.result.success).toBe(false);
            expect(res.body.result.code).toBe(401);
            done();
          });
      });

      it(`should throw validation error when required fields are not provided`, (done) => {
        agent
          .post(ENDPOINT)
          .set({
            Authorization: `Bearer ${normalToken}`,
          })
          .send({})
          .expect(400)
          .end((err, { body }) => {
            expect(body.data).toBe(null);
            expect(body.result.message).toBe(
              `"email" is required. "password" is required. "first_name" is required.`
            );
            expect(body.result.requestId).toBeTruthy();
            expect(body.result.success).toBe(false);
            expect(body.result.code).toBe(400);
            done();
          });
      });

      it(`should throw validation error when additional non-defined fields are provided`, (done) => {
        agent
          .post(ENDPOINT)
          .set({
            Authorization: `Bearer ${normalToken}`,
          })
          .send({
            email: "testam1@test.com",
            password: "Hello123",
            first_name: "Test User",
            dummy: 1,
          })
          .expect(400)
          .end((err, { body }) => {
            expect(body.data).toBe(null);
            expect(body.result.message).toBe(`"dummy" is not allowed.`);
            expect(body.result.requestId).toBeTruthy();
            expect(body.result.success).toBe(false);
            expect(body.result.code).toBe(400);
            done();
          });
      });
    });

    describe(`normal user > `, () => {
      it(`should throw unauthorized error when trying to create another user`, (done) => {
        agent
          .post(ENDPOINT)
          .set({
            Authorization: `Bearer ${normalToken}`,
          })
          .send({
            email: "test1@test.com",
            password: "Hello123",
            first_name: "Test User",
          })
          .expect(403)
          .end((err, { body }) => {
            expect(body.data).toBe(null);
            expect(body.result.message).toBe(
              "You don't have permission to do this action"
            );
            expect(body.result.requestId).toBeTruthy();
            expect(body.result.success).toBe(false);
            expect(body.result.code).toBe(403);
            done();
          });
      });

      it(`should throw unauthorized error when trying to create manager user`, (done) => {
        agent
          .post(ENDPOINT)
          .set({
            Authorization: `Bearer ${normalToken}`,
          })
          .send({
            email: "test1@test.com",
            password: "Hello123",
            first_name: "Test User",
            role_id: 2,
          })
          .expect(403)
          .end((err, { body }) => {
            expect(body.data).toBe(null);
            expect(body.result.message).toBe(
              "You don't have permission to do this action"
            );
            expect(body.result.requestId).toBeTruthy();
            expect(body.result.success).toBe(false);
            expect(body.result.code).toBe(403);
            done();
          });
      });

      it(`should throw unauthorized error when trying to create admin user`, (done) => {
        agent
          .post(ENDPOINT)
          .set({
            Authorization: `Bearer ${normalToken}`,
          })
          .send({
            email: "test1@test.com",
            password: "Hello123",
            first_name: "Test User",
            role_id: 3,
          })
          .expect(403)
          .end((err, { body }) => {
            expect(body.data).toBe(null);
            expect(body.result.message).toBe(
              "You don't have permission to do this action"
            );
            expect(body.result.requestId).toBeTruthy();
            expect(body.result.success).toBe(false);
            expect(body.result.code).toBe(403);
            done();
          });
      });
    });

    describe(`manager user > `, () => {
      it(`should throw unauthorized error when trying to create manager user`, (done) => {
        agent
          .post(ENDPOINT)
          .set({
            Authorization: `Bearer ${managerToken}`,
          })
          .send({
            email: "test1@test.com",
            password: "Hello123",
            first_name: "Test User",
            role_id: 2,
          })
          .expect(403)
          .end((err, { body }) => {
            expect(body.data).toBe(null);
            expect(body.result.message).toBe(
              "You don't have permission to do this action"
            );
            expect(body.result.requestId).toBeTruthy();
            expect(body.result.success).toBe(false);
            expect(body.result.code).toBe(403);
            done();
          });
      });

      it(`should throw unauthorized error when trying to create admin user`, (done) => {
        agent
          .post(ENDPOINT)
          .set({
            Authorization: `Bearer ${managerToken}`,
          })
          .send({
            email: "test1@test.com",
            password: "Hello123",
            first_name: "Test User",
            role_id: 3,
          })
          .expect(403)
          .end((err, { body }) => {
            expect(body.data).toBe(null);
            expect(body.result.message).toBe(
              "You don't have permission to do this action"
            );
            expect(body.result.requestId).toBeTruthy();
            expect(body.result.success).toBe(false);
            expect(body.result.code).toBe(403);
            done();
          });
      });

      it(`should be able to create normal user with valid payload`, (done) => {
        agent
          .post(ENDPOINT)
          .set({
            Authorization: `Bearer ${managerToken}`,
          })
          .send({
            email: "testmn1@test.com",
            password: "Hello123",
            first_name: "Test User",
          })
          .expect(200)
          .end((err, { body }) => {
            expect(body.data).not.toBe(null);
            expect(body.data.id).toBeTruthy();
            expect(body.result.message).toBe("User created successfully");
            expect(body.result.requestId).toBeTruthy();
            expect(body.result.success).toBe(true);
            expect(body.result.code).toBe(200);
            done();
          });
      });
    });

    describe(`admin user > `, () => {
      it(`should be able to create admin user`, (done) => {
        agent
          .post(ENDPOINT)
          .set({
            Authorization: `Bearer ${adminToken}`,
          })
          .send({
            email: "testa1@test.com",
            password: "Hello123",
            first_name: "Test User",
            role_id: 3,
          })
          .expect(200)
          .end((err, { body }) => {
            expect(body.data).not.toBe(null);
            expect(body.data.id).toBeTruthy();
            expect(body.result.message).toBe("User created successfully");
            expect(body.result.requestId).toBeTruthy();
            expect(body.result.success).toBe(true);
            expect(body.result.code).toBe(200);
            done();
          });
      });

      it(`should be able to create manager user`, (done) => {
        agent
          .post(ENDPOINT)
          .set({
            Authorization: `Bearer ${adminToken}`,
          })
          .send({
            email: "testam1@test.com",
            password: "Hello123",
            first_name: "Test User",
            role_id: 2,
          })
          .expect(200)
          .end((err, { body }) => {
            expect(body.data).not.toBe(null);
            expect(body.data.id).toBeTruthy();
            expect(body.result.message).toBe("User created successfully");
            expect(body.result.requestId).toBeTruthy();
            expect(body.result.success).toBe(true);
            expect(body.result.code).toBe(200);
            done();
          });
      });

      it(`should be able to create normal user`, (done) => {
        agent
          .post(ENDPOINT)
          .set({
            Authorization: `Bearer ${adminToken}`,
          })
          .send({
            email: "testan1@test.com",
            password: "Hello123",
            first_name: "Test User",
            role_id: 1,
          })
          .expect(200)
          .end((err, { body }) => {
            expect(body.data).not.toBe(null);
            expect(body.data.id).toBeTruthy();
            expect(body.result.message).toBe("User created successfully");
            expect(body.result.requestId).toBeTruthy();
            expect(body.result.success).toBe(true);
            expect(body.result.code).toBe(200);
            done();
          });
      });
    });
  });
});
