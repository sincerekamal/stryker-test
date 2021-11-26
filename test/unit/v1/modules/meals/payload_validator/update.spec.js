const { JoiSchemaError } = require("@errors");
const { update } = require("@modules/meals/payload_validators");
const context = {};

describe(`Meals > payload validator > update`, () => {
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

  it(`should throw schema error when time is in incorrect format`, (done) => {
    const payload = {
      id: "a105ba3d-5397-48e5-9884-b8c41e9d4c49",
      date: "2021-12-30",
      time: "2502",
      num_of_calories: 100,
    };

    try {
      update(context, payload);
    } catch (err) {
      expect(err instanceof JoiSchemaError).toBe(true);
      expect(err.message).toBe(`"time" must be in the format: 'HH:MM' in 24hr format.`);
      done();
    }
  });

  it(`should throw schema error when date is in incorrect format`, (done) => {
    const payload = {
      id: "a105ba3d-5397-48e5-9884-b8c41e9d4c49",
      date: "2021",
      time: "01:10",
      num_of_calories: 100,
    };

    try {
      update(context, payload);
    } catch (err) {
      expect(err instanceof JoiSchemaError).toBe(true);
      expect(err.message).toBe(`"date" must be in the format: 'yyyy-MM-dd'.`);
      done();
    }
  });

  it(`should not throw schema error when valid payload is provided`, (done) => {
    const payload = {
      id: "a105ba3d-5397-48e5-9884-b8c41e9d4c49",
      date: "2021-12-30",
      time: "01:10",
      num_of_calories: 100,
    };

    update(context, payload);

    done();
  });
});
