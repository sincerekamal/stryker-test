const { DatabaseError, ValidationError } = require("@errors");

describe("DatabaseError class", () => {
  it("should be instantiable", () => {
    const error = new DatabaseError();
    expect(error).toBeTruthy();
  });

  it(`should throw ValidationError when query in invalid`, () => {
    const err = {
      parent: {
        code: "ER_PARSE_ERROR",
      },
    };
    try {
      const error = new DatabaseError(err);
    } catch (err) {
      expect(err instanceof ValidationError).toBe(true);
      expect(err.message).toBe(`Invalid query. Please check the query`);
    }
  });

  it("should have Column does not exist in error message", () => {
    const err = {
      parent: {
        code: "ER_BAD_FIELD_ERROR",
        text: "column does not exists in the given table",
      },
    };
    try {
      const error = new DatabaseError(err);
    } catch (err) {
      expect(err.message).toBe(`column does not exists in the given table`);
    }
  });

  it("should have default message", () => {
    const error = new DatabaseError();

    expect(error.message).toBe("Something went wrong");
  });
});
