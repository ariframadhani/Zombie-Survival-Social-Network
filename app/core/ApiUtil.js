exports.successResponse = (data) => {
  return {
    status: 'success',
    data,
  }
}

exports.errorResponse = (message) => {
  return {
    status: 'error',
    message,
  }
}