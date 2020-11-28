class BusinessException extends Error {
  constructor(message, status = 412) {
    super(message);
    this.status = status;
  }
}

module.exports = BusinessException;
