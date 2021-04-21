const UndoScoreUseCase = require('../../../useCases/score/UndoScore/UndoScoreUseCase');

class UndoScoreController {
  /**
   * UndoScoreController
   *
   * @class
   * @param {object} container - Container
   * @param {UndoScoreUseCase} container.undoScoreUseCase - UndoScoreUseCase
   */
  constructor({ undoScoreUseCase }) {
    this.undoScoreUseCase = undoScoreUseCase;
  }

  async handle(request, response) {
    const { match } = response.locals;

    const result = await this.undoScoreUseCase.execute(match);

    return response.status(200).json(result);
  }
}

module.exports = UndoScoreController;
