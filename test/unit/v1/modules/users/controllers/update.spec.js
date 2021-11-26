const { TokenError, ValidationError } = require("@errors");
const sinon = require("sinon");
const proxyquire = require("proxyquire").noCallThru();

const getHandlerStub = sinon.stub();
const updateStub = sinon.stub();

const update = proxyquire("@modules/users/controllers/update", {
  "./get": getHandlerStub,
});

describe(`Users > controllers > update`, () => {
  beforeEach(() => {
    updateStub.resolves({ id: "u1" });
    getHandlerStub.resolves({ data: { id: "u1", update: updateStub } });
  });

  afterEach(() => {
    getHandlerStub.reset();
    updateStub.reset();
  });

  it(`should bubble up the error of getHandler service call`, async () => {
    const context = { isAdmin: true, user: { id: "1" } };
    const payload = { id: "u1" };

    getHandlerStub.rejects(new Error(`getHandler error`));

    let hasThrownError = false;
    try {
      await update(context, payload);
    } catch (err) {
      expect(err instanceof Error).toBe(true);
      expect(err.message).toBe(`getHandler error`);
      hasThrownError = true;
    } finally {
      expect(hasThrownError).toBe(true);
    }
  });

  it(`should bubble up the error of update()`, async () => {
    const context = { isAdmin: true, user: { id: "1" } };
    const payload = { id: "u1" };

    updateStub.rejects(new ValidationError(`db error`));

    let hasThrownError = false;
    try {
      await update(context, payload);
    } catch (err) {
      expect(err instanceof ValidationError).toBe(true);
      expect(err.message).toBe(`db error`);
      hasThrownError = true;
    } finally {
      expect(hasThrownError).toBe(true);
    }
  });

  it(`should update only the fields which we provide`, async () => {
    const context = { isAdmin: true, user: { id: "1" } };

    const payload = { id: "u1", num_of_calories: 99 };

    const fields = [
      { first_name: "fname" },
      { last_name: "lname" },
      { password: "pwd" },
      { target_per_day_calories: 2000 },
      { target_is_weight_loss: false },
      { target_is_weight_loss: true },
    ];

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      await update(context, { ...payload, ...field });

      expect(
        updateStub.getCall(i).calledWithExactly(
          {
            ...field,
          },
          { where: { id: "u1" } }
        )
      ).toBe(true);
    }
  });

  it(`should update user and return result when valid payload is provided`, async () => {
    const context = { isAdmin: true, user: { id: "1" } };
    const payload = { user_id: "1", id: "u1", role_id: 1 };

    const result = await update(context, payload);

    expect(result).toEqual({
      data: {
        id: "u1",
      },
      message: "User updated successfully",
    });
  });

  it(`should throw TokenError when user's role is 1 and provided role_id in payload`, async () => {
    const context = { isAdmin: false, user: { id: "1", role_id: "1" } };
    const payload = { user_id: "1", id: "u1", role_id: 1 };

    let hasThrownError = false;

    try {
      await update(context, payload);
    } catch (err) {
      expect(err instanceof TokenError).toBe(true);
      expect(err.message).toBe(`You don't have permission to do this action`);
      hasThrownError = true;
    } finally {
      expect(hasThrownError).toBe(true);
    }
  });

  it(`should not throw TokenError when user's role is 1 and not provided role_id in payload`, async () => {
    const context = { isAdmin: false, user: { id: "1", role_id: "1" } };
    const payload = { user_id: "1", id: "u1" };

    const result = await update(context, payload);

    expect(result.message).toBe(`User updated successfully`);
  });

  it(`should throw TokenError when user's role is 2 and payload role_id is same`, async () => {
    const context = { isAdmin: false, user: { id: "1", role_id: "2" } };
    const payload = { user_id: "1", id: "u1", role_id: 2 };

    let hasThrownError = false;

    try {
      await update(context, payload);
    } catch (err) {
      expect(err instanceof TokenError).toBe(true);
      expect(err.message).toBe(`You don't have permission to do this action`);
      hasThrownError = true;
    } finally {
      expect(hasThrownError).toBe(true);
    }
  });

  it(`should throw TokenError when user's role is 2 and payload role_id is higher`, async () => {
    const context = { isAdmin: false, user: { id: "1", role_id: "2" } };
    const payload = { user_id: "1", id: "u1", role_id: 3 };

    let hasThrownError = false;

    try {
      await update(context, payload);
    } catch (err) {
      expect(err instanceof TokenError).toBe(true);
      expect(err.message).toBe(`You don't have permission to do this action`);
      hasThrownError = true;
    } finally {
      expect(hasThrownError).toBe(true);
    }
  });

  it(`should not throw TokenError when user's role is admin`, async () => {
    const context = { isAdmin: true, user: { id: "1", role_id: "3" } };
    const payload = { user_id: "1", id: "u1", role_id: 3 };

    const result = await update(context, payload);

    expect(result.message).toBe(`User updated successfully`);
  });
});
