const { TokenError, ValidationError } = require("@errors");
const sinon = require("sinon");
const proxyquire = require("proxyquire").noCallThru();

const getCaloriesStub = sinon.stub();
const addMealStub = sinon.stub();

const create = proxyquire("@modules/meals/controllers/create", {
  "@services/nutrition": {
    getCalories: getCaloriesStub,
  },
  "@models": {
    Meals: {
      addMeal: addMealStub,
    },
  },
});

describe(`Meals > controllers > create`, () => {
  beforeEach(() => {
    getCaloriesStub.resolves(100);
    addMealStub.resolves({ id: "m1" });
  });

  afterEach(() => {
    getCaloriesStub.reset();
    addMealStub.reset();
  });

  it(`should throw access error if user is not admin and trying add meal for other user`, async () => {
    const context = { isAdmin: false, user: { id: "1" } };
    const payload = { user_id: "2" };

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

  it(`should bubble up the error of getCalories service call`, async () => {
    const context = { isAdmin: false, user: { id: "1" } };
    const payload = { user_id: "1" };

    getCaloriesStub.rejects(new ValidationError(`validation error`));

    let hasThrownError = false;
    try {
      await create(context, payload);
    } catch (err) {
      expect(err instanceof ValidationError).toBe(true);
      expect(err.message).toBe(`validation error`);
      hasThrownError = true;
    } finally {
      expect(hasThrownError).toBe(true);
    }
  });

  it(`should set the num_of_calories from getCalories() when num_of_calories is not set in payload`, async () => {
    const context = { isAdmin: false, user: { id: "1" } };
    const payload = { user_id: "1", description: "lunch" };

    getCaloriesStub.resolves(199);

    await create(context, payload);

    expect(getCaloriesStub.calledOnceWithExactly("lunch")).toBe(true);
    expect(addMealStub.args[0][0].num_of_calories).toBe(199);
  });

  it(`shouldn't modify the num_of_calories from getCalories() when num_of_calories is there in payload`, async () => {
    const context = { isAdmin: false, user: { id: "1" } };
    const payload = { user_id: "1", num_of_calories: 99 };

    getCaloriesStub.resolves(199);

    await create(context, payload);

    expect(addMealStub.args[0][0].num_of_calories).toBe(99);
  });

  it(`should bubble up the error of addMeal()`, async () => {
    const context = { isAdmin: false, user: { id: "1" } };
    const payload = { user_id: "1" };

    addMealStub.rejects(new ValidationError(`validation error`));

    let hasThrownError = false;
    try {
      await create(context, payload);
    } catch (err) {
      expect(err instanceof ValidationError).toBe(true);
      expect(err.message).toBe(`validation error`);
      hasThrownError = true;
    } finally {
      expect(hasThrownError).toBe(true);
    }
  });

  it(`should create meal and return result when valid payload is provided`, async () => {
    const context = { isAdmin: false, user: { id: "1" } };
    const payload = { user_id: "1", num_of_calories: 99 };

    getCaloriesStub.resolves(199);

    const result = await create(context, payload);

    expect(result).toEqual({
      data: {
        id: "m1",
      },
      message: "Meal added successfully",
    });
  });
});
