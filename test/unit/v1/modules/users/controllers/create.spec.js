const { TokenError } = require("@errors");
const sinon = require("sinon");
const proxyquire = require("proxyquire").noCallThru();

const createUserStub = sinon.stub();

const create = proxyquire("@modules/users/controllers/create", {
  "@models": {
    Users: {
      createUser: createUserStub,
    },
  },
});

describe(`Users > controllers > create`, () => {
  beforeEach(() => {
    createUserStub.resolves({ id: "u1" });
  });

  afterEach(() => {
    createUserStub.reset();
  });

  it(`should throw access error if normal user is trying to create another user`, async () => {
    const context = { isAdmin: false, user: { id: "1", role_id: 1 } };
    const payload = { user_id: "2", role_id: 1 };

    let hasThrownError = false;
    try {
      await create(context, payload);
    } catch (err) {
      expect(err instanceof TokenError).toBe(true);
      hasThrownError = true;
    } finally {
      expect(hasThrownError).toBe(true);
    }
  });

  it(`should throw access error if manager is trying to create manager user`, async () => {
    const context = { isAdmin: false, user: { id: "1", role_id: 2 } };
    const payload = { user_id: "2", role_id: 2 };

    let hasThrownError = false;
    try {
      await create(context, payload);
    } catch (err) {
      expect(err instanceof TokenError).toBe(true);
      hasThrownError = true;
    } finally {
      expect(hasThrownError).toBe(true);
    }
  });

  it(`should throw access error if manager is trying to create admin user`, async () => {
    const context = { isAdmin: false, user: { id: "1", role_id: 2 } };
    const payload = { user_id: "2", role_id: 3 };

    let hasThrownError = false;
    try {
      await create(context, payload);
    } catch (err) {
      expect(err instanceof TokenError).toBe(true);
      hasThrownError = true;
    } finally {
      expect(hasThrownError).toBe(true);
    }
  });

  it(`should not throw access error if manager is trying to create normal user`, async () => {
    const context = { isAdmin: false, user: { id: "1", role_id: 2 } };
    const payload = { user_id: "2", role_id: 1 };

    await create(context, payload);

    expect(createUserStub.calledOnceWithExactly(payload)).toBe(true);
  });

  it(`should not throw access error if admin is trying to create normal user`, async () => {
    const context = { isAdmin: true, user: { id: "1", role_id: 3 } };
    const payload = { user_id: "2", role_id: 1 };

    await create(context, payload);

    expect(createUserStub.calledOnceWithExactly(payload)).toBe(true);
  });

  it(`should not throw access error if admin is trying to create manager user`, async () => {
    const context = { isAdmin: true, user: { id: "1", role_id: 3 } };
    const payload = { user_id: "2", role_id: 2 };

    await create(context, payload);

    expect(createUserStub.calledOnceWithExactly(payload)).toBe(true);
  });

  it(`should not throw access error if admin is trying to create admin user`, async () => {
    const context = { isAdmin: true, user: { id: "1", role_id: 3 } };
    const payload = { user_id: "2", role_id: 3 };

    await create(context, payload);

    expect(createUserStub.calledOnceWithExactly(payload)).toBe(true);
  });

  it(`should create user and return user's id on success`, async () => {
    const context = { isAdmin: true, user: { id: "1", role_id: 3 } };
    const payload = { user_id: "2", role_id: 3 };

    const result = await create(context, payload);

    expect(result).toEqual({
      data: {
        id: "u1",
      },
      message: "User created successfully",
    });
  });

  it(`should bubble up the error from createUser`, async () => {
    const context = { isAdmin: false, user: { id: "1", role_id: 2 } };
    const payload = { user_id: "2", role_id: 1 };

    createUserStub.rejects(new Error("db error"));

    let hasThrownError = false;
    try {
      await create(context, payload);
    } catch (err) {
      expect(err instanceof Error).toBe(true);
      expect(err.message).toBe("db error");
      hasThrownError = true;
    } finally {
      expect(hasThrownError).toBe(true);
    }
  });
});
