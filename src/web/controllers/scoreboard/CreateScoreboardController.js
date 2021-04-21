const CreateScoreboardUseCase = require('../../../useCases/scoreboard/CreateScoreboard/CreateScoreboardUseCase');

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
    const { academyId, ...body } = request.body;
    const scoreboards = await this.createScoreboardUseCase.execute(academyId, body);

    return response.status(201).json(scoreboards);
  }
}

module.exports = CreateScoreboardController;
