const jwt = require('jsonwebtoken');

/**
 * @param request
 * @param response
 * @param next
 */
async function adminAuthenticationMiddleware(request, response, next) {
  try {
    const { Authorization: token } = request.headers;

    const user = jwt.verify(token);

    response.locals.user = user;

    return next();
  } catch (error) {
    return response.status(401).json({ message: 'Administrador não está autenticado' });
  }
}

module.exports = adminAuthenticationMiddleware;
