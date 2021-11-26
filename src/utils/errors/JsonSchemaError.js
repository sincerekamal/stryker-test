const BaseError = require("./BaseError");
const { DEF_BAD_JSON_ERROR, DEF_VALIDATION_ERROR } = require("@utils/appConstants").errorCodes;

const groupErrors = (errors = []) => {
  const missingFields = [];
  const invalidFields = [];
  const additionalFields = [];
  errors.forEach((e) => {
    switch (e.name) {
      case "required": {
        const propertyName = e.property.replace(/instance.?/gi, "");
        if (propertyName) {
          return missingFields.push(`${propertyName}.${e.argument}`);
        }
        return missingFields.push(e.argument);
      }
      case "additionalProperties": {
        return additionalFields.push(e.argument);
      }
      default:
        return invalidFields.push(
          `${e.stack.replace(/instance.?/gi, "").replace(/"/gi, "")}`
        );
    }
  });

  return {
    invalidFields,
    missingFields,
    additionalFields,
  };
};

const getJasmineMessage = (errors = []) => {
  const { invalidFields, missingFields, additionalFields } =
    groupErrors(errors);

  const errMsg = [];

  if (missingFields.length > 0) {
    errMsg.push(`${missingFields.join(", ")} fields are missing`);
  }

  if (invalidFields.length > 0) {
    errMsg.push(`${invalidFields.join(", ")} - found to be invalid`);
  }

  if (additionalFields.length > 0) {
    errMsg.push(
      `Additional fields(${additionalFields.join(", ")})
      found which doesn't exists in the given schema`
    );
  }

  return errMsg.join("\n");
};

const getMessage = (errors = []) => {
  const { invalidFields, missingFields, additionalFields } =
    groupErrors(errors);
  const errMsg = [];
  if (missingFields.length > 1) {
    errMsg.push(`required fields: ${missingFields.join(", ")} are missing.`);
  } else if (missingFields.length === 1) {
    errMsg.push(`required field: ${missingFields[0]} is missing.`);
  }

  if (invalidFields.length > 0) {
    errMsg.push(`${invalidFields.join(", ")}.`);
  }

  if (additionalFields.length > 1) {
    errMsg.push(
      `Additional properties ${additionalFields.join(
        ", "
      )} exists in the payload`
    );
  } else if (additionalFields.length === 1) {
    errMsg.push(
      `Additional property ${additionalFields[0]} exists in the payload`
    );
  }

  return errMsg.join(" ");
};

class JsonSchemaError extends BaseError {
  constructor(errors, data) {
    super(getMessage(errors), DEF_VALIDATION_ERROR, data);
    this.errors = errors;
  }

  badJson(message = 'Bad JSON Payload') {
    this.message = message;
    this.statusCode = DEF_BAD_JSON_ERROR;
    return this;
  }

  getJasmineMessage() {
    return getJasmineMessage(this.errors);
  }
}

module.exports = JsonSchemaError;
