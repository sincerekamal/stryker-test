const { ServerError } = require('@errors');

describe('ServerError class', () => {
  it('should be instantiable', () => {
    const error = new ServerError();
    expect(error).toBeTruthy();
  });

  it('should have default message', () => {
    const error = new ServerError();

    expect(error.message).toBe('Something went wrong');
  });

  it('should use actual error\'s message', () => {
    const err = new Error('Some error');
    const error = new ServerError(err);

    expect(error.message).toBe('Some error');
  });

  it('should modify the message using message()', () => {
    const error = new ServerError();
    error.setMessage('New error message');

    expect(error.message).toBe('New error message');
  });
});
