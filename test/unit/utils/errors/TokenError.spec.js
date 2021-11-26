const { TokenError } = require('@errors');
const {
  DEF_TOKEN_INVALID_ERROR,
  DEF_TOKEN_EXPIRED_ERROR
} = require('@utils/appConstants').errorCodes;

describe('TokenError class', () => {
  it('should be instantiable', () => {
    const error = new TokenError();
    expect(error).toBeTruthy();
  });

  it('should be of type invalid token by default', () => {
    const error = new TokenError();
    expect(error.statusCode).toEqual(DEF_TOKEN_INVALID_ERROR);
  });

  it('should be mutable to expired type', () => {
    const error = new TokenError();
    error.expired();
    expect(error.statusCode).toEqual(DEF_TOKEN_EXPIRED_ERROR);
  });

  it('should be mutable to invalid type', () => {
    const error = new TokenError();
    error.expired();
    error.invalid();
    expect(error.statusCode).toEqual(DEF_TOKEN_INVALID_ERROR);
  });

  it('should have chainable methods to mutate the type', () => {
    const error = new TokenError().expired();
    error.invalid().expired();
    expect(error.statusCode).toEqual(DEF_TOKEN_EXPIRED_ERROR);
  });
});
