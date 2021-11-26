const BaseError = require("@errors/BaseError");

describe("BaseError class", () => {
  it("should be instantiable", () => {
    const error = new BaseError("error message", "statusCode", "data");
    expect(error).toBeTruthy();
  });

  it(`should return the error in JSON when calling toJSON()`, () => {
    const error = new BaseError("error message", "statusCode", "data");

    const { stack, ...rest } = error.toJSON();
    expect(rest).toEqual({
      name: "BaseError",
      message: "error message",
      statusCode: "statusCode",
      data: "data",
    });
  });

  it(`should return the error in string when calling toString()`, () => {
    const error = new BaseError("error message", "statusCode", "data");

    const { stack, ...rest } = JSON.parse(error.toString());

    expect(rest).toEqual({
      name: "BaseError",
      message: "error message",
      statusCode: "statusCode",
      data: "data",
    });
  });
});
