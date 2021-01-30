const container = require('../container');
const BusinessException = require('../exceptions/BusinessException');

const matchRepository = container.resolve('matchRepository');

/**
 * @param request
 * @param response
 * @param next
 */
async function publishTokenAuthenticationMiddleware(request, response, next) {
  try {
    const { 'x-publish-token': token } = request.headers;

    if (!token) {
      throw new BusinessException('Acesso negado');
    }

    const match = await matchRepository.findMatchByPublishTokenAndIngame(token);

    if (!match) {
      throw new BusinessException('Partida não encontrada');
    }

    response.locals.match = match;

    return next();
  } catch (error) {
    return response.status(401).json({ message: error.message });
  }
}

module.exports = publishTokenAuthenticationMiddleware;
