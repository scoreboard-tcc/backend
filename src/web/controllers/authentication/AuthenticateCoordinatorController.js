const AuthenticateCoordinatorUseCase = require('../../../useCases/authentication/AuthenticateCoordinator/AuthenticateCoordinatorUseCase');

class AuthenticateCoordinatorController {
  /**
   * AuthenticateCoordinatorController
   *
   * @class
   * @param {object} container - Container
   * @param {AuthenticateCoordinatorUseCase} container.authenticateCoordinatorUseCase - AuthenticateCoordinatorUseCase
   */
  constructor({ authenticateCoordinatorUseCase }) {
    this.authenticateCoordinatorUseCase = authenticateCoordinatorUseCase;
  }

  async handle(request, response) {
    const token = await this.authenticateCoordinatorUseCase.execute(request.body);

    return response.status(200).json({ token });
  }
}

module.exports = AuthenticateCoordinatorController;
