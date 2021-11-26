const { NotFoundError } = require("@errors");
const sinon = require("sinon");
const proxyquire = require("proxyquire").noCallThru();

const findOneStub = sinon.stub();

const get = proxyquire("@modules/meals/controllers/get", {
  "@models": {
    Meals: {
      findOne: findOneStub,
    },
  },
});

describe(`Meals > controllers > get`, () => {
  beforeEach(() => {
    findOneStub.resolves({ id: "m1" });
  });

  afterEach(() => {
    findOneStub.reset();
  });

  it(`should bubble up the error of findOne`, async () => {
    const context = { isAdmin: false, user: { id: "1" } };
    const payload = { id: "m1" };

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

  it(`should add user_id condition to where clause when user is not admin`, async () => {
    const context = { isAdmin: false, user: { id: "1" } };
    const payload = { id: "m1" };

    await get(context, payload);

    expect(
      findOneStub.calledOnceWithExactly({
        where: {
          id: "m1",
          user_id: "1",
        },
      })
    ).toBe(true);
  });

  it(`shouldn't add user_id condition to where clause when user is admin`, async () => {
    const context = { isAdmin: true, user: { id: "1" } };
    const payload = { id: "m1" };

    await get(context, payload);

    expect(
      findOneStub.calledOnceWithExactly({
        where: {
          id: "m1",
        },
      })
    ).toBe(true);
  });

  it(`should throw NotFoundError when findOne returns no record`, async () => {
    const context = { isAdmin: false, user: { id: "1" } };
    const payload = { id: "m1" };

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

  it(`should get meal and return result when valid payload is provided`, async () => {
    const context = { isAdmin: false, user: { id: "1" } };
    const payload = { id: "m1" };

    const result = await get(context, payload);

    expect(result).toEqual({
      data: {
        id: "m1",
      },
      message: "Meal data fetched successfully",
    });
  });
});
