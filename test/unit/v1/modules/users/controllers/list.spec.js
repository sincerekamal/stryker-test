const { ValidationError } = require("@errors");
const sinon = require("sinon");
const proxyquire = require("proxyquire").noCallThru();

const findAndCountAllStub = sinon.stub();
const literalStub = sinon.stub();
const replaceOpsStub = sinon.stub();
const scopeStub = sinon.stub();

const list = proxyquire("@modules/users/controllers/list", {
  "@models": {
    Users: {
      scope: scopeStub,
    },
    sequelize: {
      literal: literalStub,
    },
  },
  "@utils/helpers": {
    replaceOps: replaceOpsStub,
  },
});

describe(`Users > controllers > list`, () => {
  beforeEach(() => {
    findAndCountAllStub.resolves({ rows: [{ id: "u1" }], count: 10 });
    literalStub.withArgs("formatted query").returns("full query");
    replaceOpsStub.returns("formatted query");
    scopeStub.returns({
      findAndCountAll: findAndCountAllStub,
    });
  });

  afterEach(() => {
    findAndCountAllStub.reset();
    literalStub.reset();
    replaceOpsStub.reset();
    scopeStub.reset();
  });

  it(`should bubble up the error of findAndCountAll()`, async () => {
    const context = { isAdmin: false, user: { id: "1" } };
    const payload = { query: "", limit: 1, offset: 0 };

    findAndCountAllStub.rejects(new ValidationError(`db error`));

    let hasThrownError = false;
    try {
      await list(context, payload);
    } catch (err) {
      expect(err instanceof ValidationError).toBe(true);
      expect(err.message).toBe(`db error`);
      hasThrownError = true;
    } finally {
      expect(hasThrownError).toBe(true);
    }
  });

  it(`should include user_id in where clause when user is not admin`, async () => {
    const context = { isAdmin: false, user: { id: "1" } };
    const payload = { query: "", limit: 1, offset: 10 };

    await list(context, payload);

    
    expect(
      findAndCountAllStub.calledOnceWithExactly({
        where: "full query",
        limit: 1,
        offset: 10,
      })
    ).toBe(true);
  });

  it(`shouldn't include user_id in where clause when user is admin`, async () => {
    const context = { isAdmin: true, user: { id: "1" } };
    const payload = { query: "", limit: 1, offset: 10 };

    await list(context, payload);

    expect(
      findAndCountAllStub.calledOnceWithExactly({
        where: "full query",
        limit: 1,
        offset: 10,
      })
    ).toBe(true);
  });

  it(`should return list of users when valid payload is provided`, async () => {
    const context = { isAdmin: false, user: { id: "1" } };
    const payload = { query: "", limit: 1, offset: 0 };

    const result = await list(context, payload);

    expect(result).toEqual({
      data: [{ id: "u1" }],
      message: "User(s) data fetched successfully",
      extraResult: {
        limit: 1,
        offset: 0,
        totalCount: 10,
      },
    });
  });

  it(`should return no records when payload doesn't match any record`, async () => {
    const context = { isAdmin: false, user: { id: "1" } };
    const payload = { query: "", limit: 1, offset: 0 };

    findAndCountAllStub.resolves({ rows: [], count: 2 });

    const result = await list(context, payload);

    expect(result).toEqual({
      data: [],
      message: "No matching records",
      extraResult: {
        limit: 1,
        offset: 0,
        totalCount: 2,
      },
    });
  });

  it(`should set limit and offset on successful result`, async () => {
    const context = { isAdmin: false, user: { id: "1" } };
    const payload = { query: "", limit: 10, offset: 2 };

    findAndCountAllStub.resolves({ rows: [], count: 2 });

    const result = await list(context, payload);

    expect(result).toEqual({
      data: [],
      message: "No matching records",
      extraResult: {
        limit: 10,
        offset: 2,
        totalCount: 2,
      },
    });
  });
});
