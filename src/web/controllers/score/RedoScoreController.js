const RedoScoreUseCase = require('../../../useCases/score/RedoScore/RedoScoreUseCase');

class RedoScoreController {
  /**
   * RedoScoreController
   *
   * @class
   * @param {object} container - Container
   * @param {RedoScoreUseCase} container.redoScoreUseCase - RedoScoreUseCase
   */
  constructor({ redoScoreUseCase }) {
    this.redoScoreUseCase = redoScoreUseCase;
  }

  async handle(request, response) {
    const { match } = response.locals;

    const result = await this.redoScoreUseCase.execute(match);

    return response.status(200).json(result);
  }
}

module.exports = RedoScoreController;
