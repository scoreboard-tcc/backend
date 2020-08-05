/* eslint-disable */

function errorHandler(error, request, response, next) {
  return response.status(500).json({ message: error.message });
}

module.exports = errorHandler;
