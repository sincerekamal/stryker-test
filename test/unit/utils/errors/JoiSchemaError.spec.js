const { JoiSchemaError } = require('@errors');

describe('JoiSchemaError class', () => {
  it('should be instantiable', () => {
    const error = new JoiSchemaError();
    expect(error).toBeTruthy();
  });

  it('should convert an array with one error into one message', () => {
    const errors = { details: [{ message: 'required field1 is missing.' }] };

    const error = new JoiSchemaError(errors);

    expect(error.message).toBe('required field1 is missing.');
  });

  it('should convert an array of errors into one message', () => {
    const errors = {
      details: [
        { message: 'required field1 is missing.' },
        { message: 'required field2 is missing.' }
      ]
    };

    const error = new JoiSchemaError(errors);

    expect(error.message).toBe('required field1 is missing. required field2 is missing.');
  });

  it('should join an array of errors, some without ending full stop, into one message, joined with fullstops', () => {
    const errors = {
      details: [
        { message: 'required field1 is missing' },
        { message: 'required field2 is missing.' },
        { message: 'validation failed for field3' }
      ]
    };

    const error = new JoiSchemaError(errors);

    expect(error.message).toBe(
      'required field1 is missing. required field2 is missing. validation failed for field3.'
    );
  });
});
