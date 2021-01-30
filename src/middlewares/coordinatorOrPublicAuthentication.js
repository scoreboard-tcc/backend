const jwt = require('jsonwebtoken');
const config = require('../config/secrets');

/**
 * @param request
 * @param response
 * @param next
 */
async function coordinatorOrPublicAuthenticationMiddleware(request, response, next) {
  try {
    const { authorization: token } = request.headers;

    const user = jwt.verify(token, config.jwtSecret);

    if (user.type === 'coordinator') {
      response.locals.user = user;
    }

    return next();
  } catch (error) {
    return next();
  }
}

module.exports = coordinatorOrPublicAuthenticationMiddleware;
