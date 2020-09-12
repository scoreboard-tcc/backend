class ValidationException extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

module.exports = ValidationException;
