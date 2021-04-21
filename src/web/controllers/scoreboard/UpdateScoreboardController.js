const UpdateScoreboardUseCase = require('../../../useCases/scoreboard/UpdateScoreboard/UpdateScoreboardUseCase');

class UodateScoreboardController {
  /**
   * UodateScoreboardController
   *
   * @class
   * @param {object} container - Container
   * @param {UpdateScoreboardUseCase} container.updateScoreboardUseCase - UpdateScoreboardUseCase
   */
  constructor({ updateScoreboardUseCase }) {
    this.updateScoreboardUseCase = updateScoreboardUseCase;
  }

  async handle(request, response) {
    const { id } = request.params;

    await this.updateScoreboardUseCase.execute(Number(id), request.body);

    return response.status(200).send();
  }
}

module.exports = UodateScoreboardController;
