const axios = require("axios");
const {
  nutritionService: { url, appId, appKey },
} = require("@config");
const { ServerError, ValidationError } = require("@errors");

const getCalories = async (mealStr) => {
  const request = {
    method: "POST",
    headers: {
      "x-app-id": appId,
      "x-app-key": appKey,
    },
    data: { query: mealStr },
    url,
  };
  return axios(request)
    .then((res) => {
      if (res.status === 200) {
        const { foods } = res.data;
        const totalCalories =
          foods &&
          foods.reduce((a, c) => {
            return a + c.nf_calories;
          }, 0);
        return totalCalories;
      }
      throw { response: res };
    })
    .catch(({ response: res }) => {
      if (res.status >= 400 && res.status <= 405) {
        throw new ValidationError(
          `Invalid meal, please check the meal description`
        );
      }
      throw new ServerError(`Something went wrong`);
    });
};

module.exports = {
  getCalories,
};
