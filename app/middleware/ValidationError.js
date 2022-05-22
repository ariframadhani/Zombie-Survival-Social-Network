const {ErrorValidation} = require("../core/ErrorValidation");
const {errorResponse} = require("../core/ApiUtil");

exports.ValidationError = function(err, req, res, next) {
  if(err instanceof ErrorValidation) {
    return res.json(errorResponse(err.message))
  }

  if (err) {
    return res.status(500).json(errorResponse('Something went wrong'));
  }

  next();
}