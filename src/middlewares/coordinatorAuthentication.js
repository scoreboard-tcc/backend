const jwt = require('jsonwebtoken');
const config = require('../config/secrets');

/**
 * @param request
 * @param response
 * @param next
 */
async function coordinatorAuthenticationMiddleware(request, response, next) {
  try {
    const { authorization: token } = request.headers;

    const user = jwt.verify(token, config.jwtSecret);

    if (user.type !== 'coordinator') {
      throw new Error('');
    }

    response.locals.user = user;

    return next();
  } catch (error) {
    return response.status(401).json({ message: 'Coordenador não está autenticado' });
  }
}

module.exports = coordinatorAuthenticationMiddleware;
