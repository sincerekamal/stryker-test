const { JoiSchemaError } = require("@errors");
const { createToken } = require("@public/main/payload_validators");
const context = {};

describe(`public > main > payload_validators > createToken >`, () => {
  it(`should throw schema error when required params were not provided`, (done) => {
    const payload = {};

    try {
      createToken(context, payload);
    } catch (err) {
      expect(err instanceof JoiSchemaError).toBe(true);
      expect(err.message).toBe(`"email" is required. "password" is required.`);
      done();
    }
  });

  it(`should throw schema error when additional params were provided`, (done) => {
    const payload = { email: "kamal@test.com", password: "password", dummy: 1 };

    try {
      createToken(context, payload);
    } catch (err) {
      expect(err instanceof JoiSchemaError).toBe(true);
      expect(err.message).toBe(`"dummy" is not allowed.`);
      done();
    }
  });

  it(`should return validated payload when valid payload is provided`, (done) => {
    const payload = { email: "kamal@test.com", password: "password" };

    const validated = createToken(context, payload);

    expect(validated).toEqual({
      email: "kamal@test.com",
      password: "password",
    });
    done();
  });
});
