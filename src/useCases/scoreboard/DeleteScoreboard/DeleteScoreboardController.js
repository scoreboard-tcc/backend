const DeleteScoreboardUseCase = require('./DeleteScoreboardUseCase');

class DeleteScoreboardController {
  /**
   * DeleteScoreboardController
   *
   * @class
   * @param {object} container - Container
   * @param {DeleteScoreboardUseCase} container.deleteScoreboardUseCase - DeleteScoreboardUseCase
   */
  constructor({ deleteScoreboardUseCase }) {
    this.deleteScoreboardUseCase = deleteScoreboardUseCase;
  }

  async handle(request, response) {
    const { id } = request.params;

    await this.deleteScoreboardUseCase.execute(id);

    return response.status(200).send();
  }
}

module.exports = DeleteScoreboardController;
