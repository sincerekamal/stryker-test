const proxyquire = require("proxyquire").noCallThru();
const sinon = require("sinon");

const getDataForTokenStub = sinon.stub();
const generateTokenStub = sinon.stub();

const createTokenHandler = proxyquire("@public/main/controllers/createToken", {
  "@models": {
    Users: {
      getDataForToken: getDataForTokenStub,
    },
  },
  "@middlewares/auth": {
    generateToken: generateTokenStub,
  },
});

describe(`public > main > controllers > createToken >`, () => {
  beforeEach(() => {
    getDataForTokenStub.reset();
    getDataForTokenStub.resolves({ id: "u1" });
    generateTokenStub.reset();
    generateTokenStub.resolves({ token: "token", expiresAt: 1234 });
  });

  it(`should bubble up error from getDataForToken()`, async () => {
    const context = {};
    const payload = { email: "a@test.com", password: "pwd" };
    getDataForTokenStub.rejects(new Error("db error"));

    let hasThrownError = false;
    try {
      await createTokenHandler(context, payload);
    } catch (err) {
      expect(
        getDataForTokenStub.calledOnceWithExactly({
          email: "a@test.com",
          password: "pwd",
        })
      ).toBe(true);
      expect(err instanceof Error).toBe(true);
      expect(err.message).toBe("db error");
      hasThrownError = true;
    } finally {
      expect(hasThrownError).toBe(true);
    }
  });

  it(`should bubble up error from generateToken()`, async () => {
    const context = {};
    const payload = { email: "a@test.com", password: "pwd" };
    generateTokenStub.rejects(new Error("token error"));

    let hasThrownError = false;
    try {
      await createTokenHandler(context, payload);
    } catch (err) {
      expect(
        generateTokenStub.calledOnceWithExactly({ data: { id: "u1" } })
      ).toBe(true);
      expect(err instanceof Error).toBe(true);
      expect(err.message).toBe("token error");
      hasThrownError = true;
    } finally {
      expect(hasThrownError).toBe(true);
    }
  });

  it(`should return the create token up on successful flow`, async () => {
    const context = {};
    const payload = { email: "a@test.com", password: "pwd" };

    const result = await createTokenHandler(context, payload);

    expect(result).toEqual({
      data: {
        token: "token",
        expiresAt: 1234,
      },
      message: "Token created successfully",
    });
  });
});
