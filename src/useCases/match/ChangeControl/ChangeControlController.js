const ChangeControlUseCase = require('./ChangeControlUseCase');

class ChangeControlController {
  /**
   * ChangeControlController
   *
   * @class
   * @param {object} container - Container
   * @param {ChangeControlUseCase} container.changeControlUseCase - ChangeControlUseCase
   */
  constructor({ changeControlUseCase }) {
    this.changeControlUseCase = changeControlUseCase;
  }

  async handle(request, response) {
    const { refreshToken } = request.body;

    const tokens = await this.changeControlUseCase.execute(refreshToken);

    return response.status(200).json(tokens);
  }
}

module.exports = ChangeControlController;
