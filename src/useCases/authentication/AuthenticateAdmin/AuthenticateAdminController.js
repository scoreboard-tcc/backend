const AuthenticateAdminUseCase = require('./AuthenticateAdminUseCase');

class AuthenticateAdminController {
  /**
   * AuthenticateAdminController
   *
   * @class
   * @param {object} container - Container
   * @param {AuthenticateAdminUseCase} container.authenticateAdminUseCase - AuthenticateAdminUseCase
   */
  constructor({ authenticateAdminUseCase }) {
    this.authenticateAdminUseCase = authenticateAdminUseCase;
  }

  async handle(request, response) {
    const token = await this.authenticateAdminUseCase.execute(request.body);

    return response.status(200).json({ token });
  }
}

module.exports = AuthenticateAdminController;
