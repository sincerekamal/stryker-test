const getHandler = require("@public/main/controllers/get");

describe(`public > main > controllers > get >`, () => {
  it(`should return the response for the home page`, async () => {
    const context = {};
    const payload = {};

    const result = await getHandler(context, payload);

    expect(result).toEqual({
      data: {},
      message: "Please check the API documentation for the usage",
    });
  });
});
