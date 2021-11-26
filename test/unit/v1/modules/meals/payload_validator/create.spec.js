const { JoiSchemaError, ValidationError } = require("@errors");
const { create } = require("@modules/meals/payload_validators");
const context = {};

describe(`Meals > payload validator > create`, () => {
  it(`should throw schema error when required params not provided`, (done) => {
    const payload = {};

    try {
      create(context, payload);
    } catch (err) {
      expect(err instanceof JoiSchemaError).toBe(true);
      expect(err.message).toBe(
        `"user_id" is required. "date" is required. "time" is required.`
      );
      done();
    }
  });

  it(`should throw schema error when time is in incorrect format`, (done) => {
    const payload = {
      user_id: "5b933796-22d4-5833-8436-f36b6f893f75",
      date: "2021-12-30",
      time: "2502",
      num_of_calories: 100,
    };

    try {
      create(context, payload);
    } catch (err) {
      expect(err instanceof JoiSchemaError).toBe(true);
      expect(err.message).toBe(`"time" must be in the format: 'HH:MM' in 24hr format.`);
      done();
    }
  });

  it(`should throw schema error when date is in incorrect format`, (done) => {
    const payload = {
      user_id: "5b933796-22d4-5833-8436-f36b6f893f75",
      date: "2021",
      time: "01:10",
      num_of_calories: 100,
    };

    try {
      create(context, payload);
    } catch (err) {
      expect(err instanceof JoiSchemaError).toBe(true);
      expect(err.message).toBe(`"date" must be in the format: 'yyyy-MM-dd'.`);
      done();
    }
  });

  it(`should throw error when both num_of_calories and description is missing`, (done) => {
    const payload = {
      user_id: "5b933796-22d4-5833-8436-f36b6f893f75",
      date: "2021-12-30",
      time: "01:10",
    };

    try {
      create(context, payload);
    } catch (err) {
      expect(err instanceof ValidationError).toBe(true);
      expect(err.message).toBe(
        `Either num_of_calories or description should be provided`
      );
      done();
    }
  });

  it(`should not throw schema error when valid payload is provided`, (done) => {
    const payload = {
      user_id: "5b933796-22d4-5833-8436-f36b6f893f75",
      date: "2021-12-30",
      time: "01:10",
      num_of_calories: 100,
    };

    create(context, payload);

    done();
  });
});
