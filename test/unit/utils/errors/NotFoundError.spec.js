const { NotFoundError } = require('@errors');

describe('NotFoundError class', () => {
  it('should be instantiable', () => {
    const error = new NotFoundError();
    expect(error).toBeTruthy();
  });

  it('should have default message', () => {
    const error = new NotFoundError();
    expect(error.message).toBe('Resource not found');
  });

  it('should throw with given message', () => {
    const error = new NotFoundError('not found');
    expect(error.message).toBe('not found');
  });
});
