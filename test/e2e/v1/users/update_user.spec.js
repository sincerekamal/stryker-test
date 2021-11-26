const app = require("@server");
const supertest = require("supertest");
const { getToken, getUser } = require("@e2eHelpers");
const { createUser } = require("../../testHelpers");

describe(`Users > `, () => {
  let adminToken, managerToken, normalToken;
  let adminUserId, managerUserId, normalUserId;

  beforeAll(async () => {
    adminToken = await getToken("admin");
    managerToken = await getToken("manager");
    normalToken = await getToken("normal");

    normalUserId = getUser("normal").id;
    managerUserId = getUser("manager").id;
    adminUserId = getUser("admin").id;
  });

  const agent = supertest(app);
  const ENDPOINT = "/v1/users/";

  describe(`update > `, () => {
    describe(`common >`, () => {
      it(`should throw auth error if token is not provided`, (done) => {
        agent
          .patch(ENDPOINT + normalUserId)
          .expect(401)
          .end((err, res) => {
            expect(res.body.data).toBe(null);
            expect(res.body.result.message).toBe(`jwt must be provided`);
            expect(res.body.result.success).toBe(false);
            expect(res.body.result.code).toBe(401);
            done();
          });
      });

      it(`should throw validation error if id is not provided in the url`, (done) => {
        agent
          .patch(ENDPOINT)
          .set({
            Authorization: `Bearer ${normalToken}`,
          })
          .send({
            first_name: "Test User",
          })
          .expect(400)
          .end((err, { body }) => {
            expect(body.data).toBe(null);
            expect(body.result.message).toBe(`"id" is required.`);
            expect(body.result.requestId).toBeTruthy();
            expect(body.result.success).toBe(false);
            expect(body.result.code).toBe(400);
            done();
          });
      });
    });

    describe(`normal user > `, () => {
      let testNormalUserId1;

      beforeAll(async () => {
        testNormalUserId1 = await createUser(agent, "testn1", 1);
      });

      it(`should throw error when normal user trying to update another user`, (done) => {
        agent
          .patch(ENDPOINT + testNormalUserId1)
          .set({
            Authorization: `Bearer ${normalToken}`,
          })
          .send({
            first_name: "Test User",
          })
          .expect(404)
          .end((err, { body }) => {
            expect(body.data).toBe(null);
            expect(body.result.message).toBe(
              `Requested data not found or you don't have enough access`
            );
            expect(body.result.requestId).toBeTruthy();
            expect(body.result.success).toBe(false);
            expect(body.result.code).toBe(404);
            done();
          });
      });

      it(`should throw error when normal user trying to update manager user`, (done) => {
        agent
          .patch(ENDPOINT + managerUserId)
          .set({
            Authorization: `Bearer ${normalToken}`,
          })
          .send({
            first_name: "Test User",
          })
          .expect(404)
          .end((err, { body }) => {
            expect(body.data).toBe(null);
            expect(body.result.message).toBe(
              `Requested data not found or you don't have enough access`
            );
            expect(body.result.requestId).toBeTruthy();
            expect(body.result.success).toBe(false);
            expect(body.result.code).toBe(404);
            done();
          });
      });

      it(`should throw error when normal user trying to update admin user`, (done) => {
        agent
          .patch(ENDPOINT + adminUserId)
          .set({
            Authorization: `Bearer ${normalToken}`,
          })
          .send({
            first_name: "Test User",
          })
          .expect(404)
          .end((err, { body }) => {
            expect(body.data).toBe(null);
            expect(body.result.message).toBe(
              `Requested data not found or you don't have enough access`
            );
            expect(body.result.requestId).toBeTruthy();
            expect(body.result.success).toBe(false);
            expect(body.result.code).toBe(404);
            done();
          });
      });

      it(`should throw error when normal user trying to update their own role_id`, (done) => {
        agent
          .patch(ENDPOINT + normalUserId)
          .set({
            Authorization: `Bearer ${normalToken}`,
          })
          .send({
            first_name: "Test User",
            role_id: 1,
          })
          .expect(403)
          .end((err, { body }) => {
            expect(body.data).toBe(null);
            expect(body.result.message).toBe(
              `You don't have permission to do this action`
            );
            expect(body.result.requestId).toBeTruthy();
            expect(body.result.success).toBe(false);
            expect(body.result.code).toBe(403);
            done();
          });
      });

      it(`should throw error when normal user trying to upgrade their own role to manager`, (done) => {
        agent
          .patch(ENDPOINT + normalUserId)
          .set({
            Authorization: `Bearer ${normalToken}`,
          })
          .send({
            first_name: "Test User",
            role_id: 2,
          })
          .expect(403)
          .end((err, { body }) => {
            expect(body.data).toBe(null);
            expect(body.result.message).toBe(
              `You don't have permission to do this action`
            );
            expect(body.result.requestId).toBeTruthy();
            expect(body.result.success).toBe(false);
            expect(body.result.code).toBe(403);
            done();
          });
      });

      it(`should throw error when normal user trying to upgrade their own role to admin`, (done) => {
        agent
          .patch(ENDPOINT + normalUserId)
          .set({
            Authorization: `Bearer ${normalToken}`,
          })
          .send({
            first_name: "Test User",
            role_id: 3,
          })
          .expect(403)
          .end((err, { body }) => {
            expect(body.data).toBe(null);
            expect(body.result.message).toBe(
              `You don't have permission to do this action`
            );
            expect(body.result.requestId).toBeTruthy();
            expect(body.result.success).toBe(false);
            expect(body.result.code).toBe(403);
            done();
          });
      });
    });

    describe(`manager user > `, () => {
      let testAnotherManagerUserId;

      beforeAll(async () => {
        testAnotherManagerUserId = await createUser(agent, "testn2", 2);
      });

      it(`should throw error when manager user trying to update another manager`, (done) => {
        agent
          .patch(ENDPOINT + testAnotherManagerUserId)
          .set({
            Authorization: `Bearer ${managerToken}`,
          })
          .send({
            first_name: "Test User",
          })
          .expect(404)
          .end((err, { body }) => {
            expect(body.data).toBe(null);
            expect(body.result.message).toBe(
              `Requested data not found or you don't have enough access`
            );
            expect(body.result.requestId).toBeTruthy();
            expect(body.result.success).toBe(false);
            expect(body.result.code).toBe(404);
            done();
          });
      });

      it(`should not throw error when manager user trying to update normal user`, (done) => {
        agent
          .patch(ENDPOINT + normalUserId)
          .set({
            Authorization: `Bearer ${managerToken}`,
          })
          .send({
            first_name: "Test User",
          })
          .expect(200)
          .end((err, { body }) => {
            expect(body.data).toBeTruthy();
            expect(body.result.message).toBe(`User updated successfully`);
            expect(body.result.requestId).toBeTruthy();
            expect(body.result.success).toBe(true);
            expect(body.result.code).toBe(200);
            done();
          });
      });

      it(`should throw error when manager user trying to update admin user`, (done) => {
        agent
          .patch(ENDPOINT + adminUserId)
          .set({
            Authorization: `Bearer ${managerToken}`,
          })
          .send({
            first_name: "Test User",
          })
          .expect(404)
          .end((err, { body }) => {
            expect(body.data).toBe(null);
            expect(body.result.message).toBe(
              `Requested data not found or you don't have enough access`
            );
            expect(body.result.requestId).toBeTruthy();
            expect(body.result.success).toBe(false);
            expect(body.result.code).toBe(404);
            done();
          });
      });

      it(`should throw error when manager user trying to set their own role_id to same role`, (done) => {
        agent
          .patch(ENDPOINT + managerUserId)
          .set({
            Authorization: `Bearer ${managerToken}`,
          })
          .send({
            first_name: "Test User",
            role_id: 2,
          })
          .expect(403)
          .end((err, { body }) => {
            expect(body.data).toBe(null);
            expect(body.result.message).toBe(
              `You don't have permission to do this action`
            );
            expect(body.result.requestId).toBeTruthy();
            expect(body.result.success).toBe(false);
            expect(body.result.code).toBe(403);
            done();
          });
      });

      it(`should throw error when manager user trying to set their own role_id to higher role`, (done) => {
        agent
          .patch(ENDPOINT + managerUserId)
          .set({
            Authorization: `Bearer ${managerToken}`,
          })
          .send({
            first_name: "Test User",
            role_id: 3,
          })
          .expect(403)
          .end((err, { body }) => {
            expect(body.data).toBe(null);
            expect(body.result.message).toBe(
              `You don't have permission to do this action`
            );
            expect(body.result.requestId).toBeTruthy();
            expect(body.result.success).toBe(false);
            expect(body.result.code).toBe(403);
            done();
          });
      });

      it(`should not throw error when manager user trying to set their own role_id to lower role`, (done) => {
        agent
          .patch(ENDPOINT + managerUserId)
          .set({
            Authorization: `Bearer ${managerToken}`,
          })
          .send({
            first_name: "Test User",
            role_id: 1,
          })
          .expect(200)
          .end((err, { body }) => {
            expect(body.data).toBeTruthy();
            expect(body.result.message).toBe(`User updated successfully`);
            expect(body.result.requestId).toBeTruthy();
            expect(body.result.success).toBe(true);
            expect(body.result.code).toBe(200);
            done();
          });
      });
    });
  });
});
