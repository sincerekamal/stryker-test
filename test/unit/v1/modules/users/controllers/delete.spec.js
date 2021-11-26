const { ValidationError } = require("@errors");
const sinon = require("sinon");
const proxyquire = require("proxyquire").noCallThru();

const updateStub = sinon.stub();
const getHandlerStub = sinon.stub();

const deleteC = proxyquire("@modules/users/controllers/delete", {
  "./get": getHandlerStub,
});

describe(`Users > controllers > delete`, () => {
  beforeEach(() => {
    updateStub.resolves({ id: "u1" });
    getHandlerStub.resolves({ data: { id: "u1", update: updateStub } });
  });

  afterEach(() => {
    getHandlerStub.reset();
    updateStub.reset();
  });

  it(`should bubble up the error of getHandler service call`, async () => {
    const context = { isAdmin: false, user: { id: "1", role_id: 2 } };
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

  it(`should bubble up the error of update()`, async () => {
    const context = { isAdmin: false, user: { id: "1", role_id: 2 } };
    const payload = { user_id: "1" };

    updateStub.rejects(new ValidationError(`db error`));

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

  it(`should set user status inactive and return result when valid payload is provided`, async () => {
    const context = { isAdmin: false, user: { id: "1", role_id: 2 } };
    const payload = { id: "u1" };

    const result = await deleteC(context, payload);

    expect(result).toEqual({
      data: {
        id: "u1",
      },
      message: "User deleted successfully",
    });
  });

  it(`should call update() with valid fields`, async () => {
    const context = { isAdmin: false, user: { id: "1", role_id: 2 } };
    const payload = { id: "u1" };

    await deleteC(context, payload);

    expect(updateStub.calledOnce).toBe(true);
    expect(updateStub.args[0].length).toBe(2);
    expect(updateStub.args[0][0].status).toBe("inactive");
    expect(updateStub.args[0][0].deleted_at).not.toBe(null);
    expect(updateStub.args[0][1]).toEqual({
      where: {
        id: "u1",
      },
    });
  });
});
