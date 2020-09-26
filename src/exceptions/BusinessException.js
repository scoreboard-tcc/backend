class BusinessException extends Error {
  constructor(message) {
    super(message);
    this.status = 412;
  }
}

module.exports = BusinessException;
