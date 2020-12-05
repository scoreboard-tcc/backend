const CreateScoreboardUseCase = require('./CreateScoreboardUseCase');

class CreateScoreboardController {
  /**
   * CreateScoreboardController
   *
   * @class
   * @param {object} container - Container
   * @param {CreateScoreboardUseCase} container.createScoreboardUseCase - CreateScoreboardUseCase
   */
  constructor({ createScoreboardUseCase }) {
    this.createScoreboardUseCase = createScoreboardUseCase;
  }

  async handle(request, response) {
    const { id: academyId } = request.params;
    const scoreboards = await this.createScoreboardUseCase.execute(academyId, request.body);

    return response.status(201).json(scoreboards);
  }
}

module.exports = CreateScoreboardController;
