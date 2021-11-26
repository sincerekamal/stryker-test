const { JoiSchemaError } = require("@errors");
const { update } = require("@modules/users/payload_validators");
const context = {};

describe(`Users > payload validator > update`, () => {
  it(`should throw schema error when required params not provided`, (done) => {
    const payload = {};

    try {
      update(context, payload);
    } catch (err) {
      expect(err instanceof JoiSchemaError).toBe(true);
      expect(err.message).toBe(`"id" is required.`);
      done();
    }
  });

  it(`should throw schema error when additional field is provided`, (done) => {
    const payload = {
      dummy: 1,
      id: "5b933796-22d4-5833-8436-f36b6f893f75",
    };

    try {
      update(context, payload);
    } catch (err) {
      expect(err instanceof JoiSchemaError).toBe(true);
      expect(err.message).toBe(`"dummy" is not allowed.`);
      done();
    }
  });
});
