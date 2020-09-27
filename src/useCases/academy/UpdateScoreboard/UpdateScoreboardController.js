const UpdateScoreboardUseCase = require('./UpdateScoreboardUseCase');

class DeleteScoreboardController {
  /**
   * DeleteScoreboardController
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

module.exports = DeleteScoreboardController;
