class BaseError extends Error {
  constructor(messege, statusCode = 500) {
    super(messege)
    this.statusCode = statusCode
  }
}

module.exports = {
  BaseError,
}
