const { TokenError, ValidationError } = require("@errors");
const sinon = require("sinon");
const proxyquire = require("proxyquire").noCallThru();

const destroyStub = sinon.stub();
const getHandlerStub = sinon.stub();

const deleteC = proxyquire("@modules/meals/controllers/delete", {
  "./get": getHandlerStub,
});

describe(`Meals > controllers > delete`, () => {
  beforeEach(() => {
    destroyStub.resolves({ id: "m1" });
    getHandlerStub.resolves({ data: { id: "m1", destroy: destroyStub } });
  });

  afterEach(() => {
    getHandlerStub.reset();
    destroyStub.reset();
  });

  it(`should bubble up the error of getHandler service call`, async () => {
    const context = { isAdmin: false, user: { id: "1" } };
    const payload = { user_id: "1" };

    getHandlerStub.rejects(new Error(`getHandler error`));

    let hasThrownError = false;
    try {
      await deleteC(context, payload);
    } catch (err) {
      expect(err instanceof Error).toBe(true);
      expect(err.message).toBe(`getHandler error`);
      hasThrownError = true;
    } finally {
      expect(hasThrownError).toBe(true);
    }
  });

  it(`should bubble up the error of destroy()`, async () => {
    const context = { isAdmin: false, user: { id: "1" } };
    const payload = { user_id: "1" };

    destroyStub.rejects(new ValidationError(`db error`));

    let hasThrownError = false;
    try {
      await deleteC(context, payload);
    } catch (err) {
      expect(err instanceof ValidationError).toBe(true);
      expect(err.message).toBe(`db error`);
      hasThrownError = true;
    } finally {
      expect(hasThrownError).toBe(true);
    }
  });

  it(`should delete meal and return result when valid payload is provided`, async () => {
    const context = { isAdmin: false, user: { id: "1" } };
    const payload = { id: "m1" };

    const result = await deleteC(context, payload);

    expect(result).toEqual({
      data: {
        id: "m1",
      },
      message: "Meal deleted successfully",
    });
  });
});
