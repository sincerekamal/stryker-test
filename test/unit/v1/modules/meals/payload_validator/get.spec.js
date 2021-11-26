const { JoiSchemaError } = require("@errors");
const { get } = require("@modules/meals/payload_validators");
const context = {};

describe(`Meals > payload validator > get`, () => {
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
    const payload = {
      id: "f88f3fd8-fe73-4c9d-bee2-eea43b14cfa4",
    };

    get(context, payload);

    done();
  });
});
