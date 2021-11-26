const { TokenError, ValidationError } = require("@errors");
const sinon = require("sinon");
const proxyquire = require("proxyquire").noCallThru();

const getCaloriesStub = sinon.stub();
const updateStub = sinon.stub();
const getHandlerStub = sinon.stub();

const update = proxyquire("@modules/meals/controllers/update", {
  "@services/nutrition": {
    getCalories: getCaloriesStub,
  },
  "./get": getHandlerStub,
});

describe(`Meals > controllers > update`, () => {
  beforeEach(() => {
    getCaloriesStub.resolves(100);
    updateStub.resolves({ id: "m1" });
    getHandlerStub.resolves({ data: { update: updateStub } });
  });

  afterEach(() => {
    getHandlerStub.reset();
    getCaloriesStub.reset();
    updateStub.reset();
  });

  it(`should bubble up the error of getHandler service call`, async () => {
    const context = { isAdmin: false, user: { id: "1" } };
    const payload = { id: "m1" };

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

  it(`should bubble up the error of getCalories service call`, async () => {
    const context = { isAdmin: false, user: { id: "1" } };
    const payload = { id: "m1", description: "lunch" };

    getCaloriesStub.rejects(new ValidationError(`getCalories error`));

    let hasThrownError = false;
    try {
      await update(context, payload);
    } catch (err) {
      expect(err instanceof ValidationError).toBe(true);
      expect(err.message).toBe(`getCalories error`);
      hasThrownError = true;
    } finally {
      expect(hasThrownError).toBe(true);
    }
  });

  it(`should set the num_of_calories from getCalories() when num_of_calories is not set in payload`, async () => {
    const context = { isAdmin: false, user: { id: "1" } };
    const payload = { id: "m1", description: "lunch" };

    getCaloriesStub.resolves(199);

    await update(context, payload);

    expect(getCaloriesStub.calledOnceWithExactly("lunch")).toBe(true);
    expect(updateStub.args[0][0].num_of_calories).toBe(199);
  });

  it(`shouldn't modify the num_of_calories from getCalories() when num_of_calories is there in payload`, async () => {
    const context = { isAdmin: false, user: { id: "1" } };
    const payload = { id: "m1", num_of_calories: 99 };

    getCaloriesStub.resolves(199);

    await update(context, payload);

    expect(updateStub.args[0][0].num_of_calories).toBe(99);
  });

  it(`should bubble up the error of update()`, async () => {
    const context = { isAdmin: false, user: { id: "1" } };
    const payload = { id: "m1" };

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
    const context = { isAdmin: false, user: { id: "1" } };
    getCaloriesStub.resolves(199);

    const payload = { user_id: "1", id: "m1", num_of_calories: 99 };

    const fields = [
      { description: "lunch" },
      { date: "10-08-2021" },
      { time: "18:30" },
    ];

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      await update(context, { ...payload, ...field });

      expect(
        updateStub.getCall(i).calledWithExactly(
          {
            num_of_calories: 99,
            ...field,
          },
          { where: { id: "m1" } }
        )
      ).toBe(true);
    }
  });

  it(`should update meal and return result when valid payload is provided`, async () => {
    const context = { isAdmin: false, user: { id: "1" } };
    const payload = { user_id: "1", id: "m1", num_of_calories: 99 };

    getCaloriesStub.resolves(199);

    const result = await update(context, payload);

    expect(result).toEqual({
      data: {
        id: "m1",
      },
      message: "Meal updated successfully",
    });
  });
});
