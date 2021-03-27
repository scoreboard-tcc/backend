/**
 * @param error
 * @param request
 * @param response
 * @param next
 */
async function errorHandler(error, request, response, next) {
  const { message = 'Erro desconhecido', status = 500 } = error;

  return response.status(status).json({ message });
}

module.exports = errorHandler;
