class NoResultError extends Error {
  constructor(message) {
    super(message);
    this.name = "NoResultError";
  }
}

module.exports.NoResultError = NoResultError;