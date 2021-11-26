const { ServerError, ValidationError } = require("@errors");
const sinon = require("sinon");
const {
  nutritionService: { url, appId, appKey },
} = require("@config");
const proxyquire = require("proxyquire").noCallThru();

const axiosStub = sinon.stub();
const addMealStub = sinon.stub();

describe(`services > nutrition >`, () => {
  describe(`getCalories > `, () => {
    const { getCalories } = proxyquire("@services/nutrition", {
      axios: axiosStub,
    });

    beforeEach(() => {
      axiosStub.resolves({ status: 200, data: { foods: [] } });
    });

    afterEach(() => {
      axiosStub.reset();
    });

    it(`should form the request as expected`, async () => {
      const mealStr = "1 banana";

      await getCalories(mealStr);

      expect(
        axiosStub.calledOnceWithExactly({
          method: "POST",
          headers: {
            "x-app-id": appId,
            "x-app-key": appKey,
          },
          data: { query: mealStr },
          url,
        })
      ).toBe(true);
      // expect(axiosStub.args[0][0].headers["x-app-id"]).toBeTruthy();
      // expect(axiosStub.args[0][0].headers["x-app-key"]).toBeTruthy();
    });

    it(`should calculate totalCalories from the foods and if status = 200`, async () => {
      const mealStr = "1 banana";
      axiosStub.resolves({
        status: 200,
        data: { foods: [{ nf_calories: 200 }, { nf_calories: 300 }] },
      });

      const totalCalories = await getCalories(mealStr);

      expect(totalCalories).toBe(500);
    });

    it(`shouldn't calculate totalCalories from the foods if status != 200`, async () => {
      const mealStr = "1 banana";
      axiosStub.resolves({
        status: 301,
        data: { foods: [{ nf_calories: 200 }, { nf_calories: 300 }] },
      });

      let hasThrownError = false;
      try {
        await getCalories(mealStr);
      } catch (err) {
        expect(err instanceof ServerError).toBe(true);
        expect(err.message).toBe(`Something went wrong`);
        hasThrownError = true;
      } finally {
        expect(hasThrownError).toBe(true);
      }
    });

    it(`should throw validation error if response status is 4xx`, async () => {
      const mealStr = "1 banana";

      for (let i = 400; i <= 405; i++) {
        axiosStub.rejects({
          response: { status: i },
        });

        let hasThrownError = false;
        try {
          await getCalories(mealStr);
        } catch (err) {
          expect(err instanceof ValidationError).toBe(true);
          expect(err.message).toBe(
            `Invalid meal, please check the meal description`
          );
          hasThrownError = true;
        } finally {
          expect(hasThrownError).toBe(true);
        }
      }
    });

    it(`should throw server error if response status is neither 200 or 4xx`, async () => {
      const mealStr = "1 banana";

      axiosStub.rejects({
        response: { status: 500 },
      });

      let hasThrownError = false;
      try {
        await getCalories(mealStr);
      } catch (err) {
        expect(err instanceof ServerError).toBe(true);
        expect(err.message).toBe(`Something went wrong`);
        hasThrownError = true;
      } finally {
        expect(hasThrownError).toBe(true);
      }
    });
  });
});
