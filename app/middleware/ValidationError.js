const {ValidationError} = require("../core/ErrorValidation");

exports.validationError = (error, req, res, next) => {
  console.log('errrror', req)
  if (next.constructor === ValidationError) {
    console.log('ok');
    // return response.json(errorCode(ErrorCode.VALIDATION_ERROR, err.message));
  }
  next();
};