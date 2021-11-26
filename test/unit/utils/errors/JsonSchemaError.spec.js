const { JsonSchemaError } = require('@errors');

describe('JsonSchemaError class', () => {
  it('should be instantiable', () => {
    const error = new JsonSchemaError();
    expect(error).toBeTruthy();
  });

  it('should convert one missing field into singular message', () => {
    const errors = [{ argument: 'field1', name: 'required', property: 'instance' }];

    const error = new JsonSchemaError(errors);

    expect(error.message).toBe('required field: field1 is missing.');
  });

  it('should convert more than one missing fields into plural message', () => {
    const errors = [
      { argument: 'field1', name: 'required', property: 'instance' },
      { argument: 'field2', name: 'required', property: 'instance' }
    ];

    const error = new JsonSchemaError(errors);

    expect(error.message).toBe('required fields: field1, field2 are missing.');
  });
});
