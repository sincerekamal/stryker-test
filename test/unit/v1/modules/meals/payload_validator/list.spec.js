const { JoiSchemaError } = require("@errors");
const { list } = require("@modules/meals/payload_validators");
const context = {};

describe(`Meals > payload validator > list`, () => {
  it(`should throw schema error when params not defined in schema are provided`, (done) => {
    const payload = { dummy: 1 };

    try {
      list(context, payload);
    } catch (err) {
      expect(err instanceof JoiSchemaError).toBe(true);
      expect(err.message).toBe(`"dummy" is not allowed.`);
      done();
    }
  });

  it(`should throw schema error when limit is more than configured max value`, (done) => {
    const payload = {
      limit: 501,
    };

    try {
      list(context, payload);
    } catch (err) {
      expect(err instanceof JoiSchemaError).toBe(true);
      expect(err.message).toBe(`"limit" must be less than or equal to 500.`);
      done();
    }
  });

  it(`should throw schema error when limit is less than configured min value`, (done) => {
    const payload = {
      limit: 0,
    };

    try {
      list(context, payload);
    } catch (err) {
      expect(err instanceof JoiSchemaError).toBe(true);
      expect(err.message).toBe(`"limit" must be greater than or equal to 1.`);
      done();
    }
  });

  it(`should throw schema error when offset is less than configured min value`, (done) => {
    const payload = {
      offset: -1,
    };

    try {
      list(context, payload);
    } catch (err) {
      expect(err instanceof JoiSchemaError).toBe(true);
      expect(err.message).toBe(`"offset" must be greater than or equal to 0.`);
      done();
    }
  });

  it(`should throw schema error when query is less than min length`, (done) => {
    const payload = {
      query: "1",
    };

    try {
      list(context, payload);
    } catch (err) {
      expect(err instanceof JoiSchemaError).toBe(true);
      expect(err.message).toBe(
        `"query" length must be at least 6 characters long.`
      );
      done();
    }
  });
});
