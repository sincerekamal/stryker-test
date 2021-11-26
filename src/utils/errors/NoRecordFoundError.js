const BaseError = require('./BaseError');
const { NO_MATCHING_RECORD } = require('../appConstants').errorCodes;

class NoRecordFoundError extends BaseError {
  constructor(message, data) {
    super(message, NO_MATCHING_RECORD, data);
    this.message = message || 'No matching records found';
  }
}

module.exports = NoRecordFoundError;
