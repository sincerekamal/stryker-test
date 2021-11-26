const { JoiSchemaError } = require("@errors");
const { create } = require("@modules/users/payload_validators");
const context = {};

describe(`Users > payload validator > create`, () => {
  it(`should throw schema error when required params not provided`, (done) => {
    const payload = {};

    try {
      create(context, payload);
    } catch (err) {
      expect(err instanceof JoiSchemaError).toBe(true);
      expect(err.message).toBe(
        `"email" is required. "password" is required. "first_name" is required.`
      );
      done();
    }
  });

  it(`should throw schema error when email is in incorrect format`, (done) => {
    const payload = {
      email: "kamal",
      password: "hello123",
      first_name: "kamal",
    };

    try {
      create(context, payload);
    } catch (err) {
      expect(err instanceof JoiSchemaError).toBe(true);
      expect(err.message).toBe(`"email" must be a valid email.`);
      done();
    }
  });

  it(`should not throw schema error when valid payload is provided`, (done) => {
    const payload = {
      email: "kamal@test.com",
      password: "hello123",
      first_name: "kamal",
    };

    create(context, payload);

    done();
  });

  it(`should throw schema error when additional field is provided`, (done) => {
    const payload = {
      dummy: 1,
      email: "kamal@test.com",
      password: "hello123",
      first_name: "kamal",
    };

    try {
      create(context, payload);
    } catch (err) {
      expect(err instanceof JoiSchemaError).toBe(true);
      expect(err.message).toBe(`"dummy" is not allowed.`);
      done();
    }
  });
});
