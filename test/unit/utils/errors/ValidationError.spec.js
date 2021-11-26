const { ValidationError } = require('@errors');
const { DEF_VALIDATION_ERROR } = require('@utils/appConstants').errorCodes;

describe('ValidationError class', () => {
  it('should be instantiable', () => {
    const error = new ValidationError();
    expect(error).toBeTruthy();
  });

  it('should throw with given message', () => {
    const error = new ValidationError('validation error');
    expect(error.message).toBe('validation error');
  });

  it('should throw error with validation status code', () => {
    const error = new ValidationError('validation error');
    expect(error.statusCode).toBe(DEF_VALIDATION_ERROR);
  });
});
