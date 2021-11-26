const { NotFoundError } = require("@errors");
const sinon = require("sinon");
const proxyquire = require("proxyquire").noCallThru();

const findOneStub = sinon.stub();
const scopeStub = sinon.stub();
scopeStub.returns({ findOne: findOneStub });

const get = proxyquire("@modules/users/controllers/get", {
  "@models": {
    Users: {
      scope: scopeStub,
    },
  },
});

describe(`Users > controllers > get`, () => {
  beforeEach(() => {
    findOneStub.resolves({ id: "u1" });
  });

  afterEach(() => {
    findOneStub.reset();
  });

  it(`should bubble up the error of findOne`, async () => {
    const context = { isAdmin: false, user: { id: "1" }, dataScope: "scope" };
    const payload = { id: "u1" };

    findOneStub.rejects(new Error(`db error`));

    let hasThrownError = false;
    try {
      await get(context, payload);
    } catch (err) {
      expect(err instanceof Error).toBe(true);
      expect(err.message).toBe(`db error`);
      hasThrownError = true;
    } finally {
      expect(hasThrownError).toBe(true);
    }
  });

  it(`should throw NotFoundError when findOne returns no record`, async () => {
    const context = { isAdmin: false, user: { id: "1" }, dataScope: "scope" };
    const payload = { id: "u1" };

    findOneStub.resolves(null);

    let hasThrownError = false;
    try {
      await get(context, payload);
    } catch (err) {
      expect(err instanceof NotFoundError).toBe(true);
      expect(err.message).toBe(
        `Requested data not found or you don't have enough access`
      );
      hasThrownError = true;
    } finally {
      expect(hasThrownError).toBe(true);
    }
  });

  it(`should get User and return result when valid payload is provided`, async () => {
    const context = { isAdmin: false, user: { id: "1" }, dataScope: "scope" };
    const payload = { id: "u1" };

    const result = await get(context, payload);

    expect(result).toEqual({
      data: {
        id: "u1",
      },
      message: "User data fetched successfully",
    });
  });
});
