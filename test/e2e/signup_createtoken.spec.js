const app = require("@server");
const supertest = require("supertest");

describe(``, () => {
  const agent = supertest(app);

  describe(`signup > `, () => {
    it(`should throw validation error if required fields are not provided`, (done) => {
      agent
        .post("/signup")
        .send({
          // empty body
        })
        .expect(400)
        .end((err, res) => {
          expect(res.body.data).toBe(null);
          expect(res.body.result.message).toBe(
            `"email" is required. "password" is required. "first_name" is required.`
          );
          expect(res.body.result.success).toBe(false);
          expect(res.body.result.code).toBe(400);
          done();
        });
    });

    it(`should throw error if additional fields are provided in the payload`, (done) => {
      agent
        .post("/signup")
        .send({
          email: "kamal@test.com",
          password: "kamal123",
          first_name: "Kamal",
          dummy: 1,
        })
        .expect(400)
        .end((err, res) => {
          expect(res.body.data).toBe(null);
          expect(res.body.result.message).toBe(`"dummy" is not allowed.`);
          expect(res.body.result.success).toBe(false);
          expect(res.body.result.code).toBe(400);
          done();
        });
    });

    it(`should create user if it has valid payload`, (done) => {
      agent
        .post("/signup")
        .send({
          email: "test1@test.com",
          password: "kamal123",
          first_name: "Kamal",
        })
        .expect(200)
        .end((err, res) => {
          expect(res.body.data.id).toBeTruthy();
          expect(res.body.result.message).toBe(`User created successfully`);
          expect(res.body.result.success).toBe(true);
          expect(res.body.result.code).toBe(200);
          done();
        });
    });

    it(`should throw error if user already exists with same email`, (done) => {
      agent
        .post("/signup")
        .send({
          email: "test1@test.com",
          password: "kamal123",
          first_name: "Kamal",
        })
        .expect(400)
        .end((err, res) => {
          expect(res.body.data).toBe(null);
          expect(res.body.result.message).toBe(
            `User already exists with given email`
          );
          expect(res.body.result.success).toBe(false);
          expect(res.body.result.code).toBe(400);
          done();
        });
    });
  });

  describe(`createToken >`, () => {
    it(`should throw error if required params are not provided`, (done) => {
      agent
        .post("/create_token")
        .send({})
        .expect(400)
        .end((err, res) => {
          expect(res.body.data).toBe(null);
          expect(res.body.result.message).toBe(
            `"email" is required. "password" is required.`
          );
          expect(res.body.result.success).toBe(false);
          expect(res.body.result.code).toBe(400);
          done();
        });
    });

    it(`should throw error if additional fields are provided in the payload`, (done) => {
      agent
        .post("/create_token")
        .send({
          email: "kamal@test.com",
          password: "kamal123",
          dummy: 1,
        })
        .expect(400)
        .end((err, res) => {
          expect(res.body.data).toBe(null);
          expect(res.body.result.message).toBe(`"dummy" is not allowed.`);
          expect(res.body.result.success).toBe(false);
          expect(res.body.result.code).toBe(400);
          done();
        });
    });

    it(`should create token if valid payload is provided`, (done) => {
      agent
        .post("/create_token")
        .send({
          email: "test1@test.com",
          password: "kamal123",
        })
        .end((err, res) => {
          expect(res.body.data.token).toBeTruthy();
          expect(res.body.data.expiresAt).toBeTruthy();
          expect(res.body.result.code).toBe(200);
          expect(res.body.result.success).toBe(true);
          expect(res.body.result.message).toBe(`Token created successfully`);
          done();
        });
    });
  });
});
