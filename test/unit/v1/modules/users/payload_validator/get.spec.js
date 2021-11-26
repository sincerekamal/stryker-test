const { JoiSchemaError } = require("@errors");
const { get } = require("@modules/users/payload_validators");
const context = {};

describe(`Users > payload validator > get`, () => {
  it(`should throw schema error when required params not provided`, (done) => {
    const payload = {};

    try {
      get(context, payload);
    } catch (err) {
      expect(err instanceof JoiSchemaError).toBe(true);
      expect(err.message).toBe(`"id" is required.`);
      done();
    }
  });

  it(`should not throw schema error when valid payload is provided`, (done) => {
    const payload = { id: "5b933796-22d4-5833-8436-f36b6f893f75" };

    get(context, payload);

    done();
  });
});
