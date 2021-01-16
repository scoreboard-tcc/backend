const RedoScoreUseCase = require('./RedoScoreUseCase');

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

    const canRedo = await this.redoScoreUseCase.execute(match);

    return response.status(200).json({ canRedo });
  }
}

module.exports = RedoScoreController;
