const FinishMatchUseCase = require('../../../useCases/match/FinishMatch/FinishMatchUseCase');

class FinishMatchController {
  /**
   * FinishMatchController
   *
   * @class
   * @param {object} container - Container
   * @param {FinishMatchUseCase} container.finishMatchUseCase - FinishMatchUseCase
   */
  constructor({ finishMatchUseCase }) {
    this.finishMatchUseCase = finishMatchUseCase;
  }

  async handle(request, response) {
    const { matchId } = request.params;

    await this.finishMatchUseCase.executeByMatchId(Number(matchId));

    return response.status(200).end();
  }
}

module.exports = FinishMatchController;
