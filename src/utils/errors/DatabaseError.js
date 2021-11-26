const BaseError = require("./BaseError");
const ValidationError = require("./ValidationError");
const { DEF_DB_ERROR } = require("../appConstants").errorCodes;

const getErrorMessage = (err) => {
  let message = "Something went wrong";
  // TODO: parse the error object and format accordingly
  switch (err?.parent?.code) {
    case "ER_PARSE_ERROR":
      message = "Invalid query. Please check the query";
      throw new ValidationError(message);
      break;
    case "ER_BAD_FIELD_ERROR":
      message = err.parent.text;
      break;
  }
  return message;
};

class DatabaseError extends BaseError {
  constructor(err) {
    super(err && err.message, DEF_DB_ERROR, err);
    this.message = getErrorMessage(err);
  }
}

module.exports = DatabaseError;
