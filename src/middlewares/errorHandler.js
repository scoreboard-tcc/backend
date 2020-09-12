/* eslint-disable */

function errorHandler(error, request, response, next) {
  const {message = 'Erro desconhecido', status = 500} = error

  return response.status(status).json({message});
}

module.exports = errorHandler;
