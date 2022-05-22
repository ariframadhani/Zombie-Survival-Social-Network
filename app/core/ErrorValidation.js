class ErrorValidation extends Error {
  constructor(message) {
    super(message);
  }
}

exports.ValidationError = ErrorValidation;