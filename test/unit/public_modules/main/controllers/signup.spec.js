const proxyquire = require("proxyquire").noCallThru();
const sinon = require("sinon");

const createUserStub = sinon.stub();

const signupHandler = proxyquire("@public/main/controllers/signup", {
  "@models": {
    Users: {
      createUser: createUserStub,
    },
  },
});

describe(`public > main > controllers > signup >`, () => {
  beforeEach(() => {
    createUserStub.reset();
    createUserStub.resolves({ id: "u1" });
  });

  it(`should bubble up error from createUser()`, async () => {
    const payload = {};
    const context = {};
    createUserStub.rejects(new Error("db error"));

    let hasThrownError = false;
    try {
      await signupHandler(context, payload);
    } catch (err) {
      expect(createUserStub.calledOnceWithExactly({})).toBe(true);
      expect(err instanceof Error).toBe(true);
      expect(err.message).toBe("db error");
      hasThrownError = true;
    } finally {
      expect(hasThrownError).toBe(true);
    }
  });

  it(`should return the create user id up on successful flow`, async () => {
    const payload = {};
    const context = {};

    const result = await signupHandler(context, payload);

    expect(createUserStub.calledOnceWithExactly({})).toBe(true);
    expect(result).toEqual({
      data: {
        id: "u1",
      },
      message: "User created successfully",
    });
  });
});
