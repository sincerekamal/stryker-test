class BaseError extends Error {
  constructor(message, statusCode, data = {}) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;

    // Capturing
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      data: this.data,
      stack: this.stack
    };
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }
}

module.exports = BaseError;
