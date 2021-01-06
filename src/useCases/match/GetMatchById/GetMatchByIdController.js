const GetMatchByIdUseCase = require('./GetMatchByIdUseCase');

class GetMatchByIdController {
  /**
   * GetMatchByIdController
   *
   * @class
   * @param {object} container - Container
   * @param {GetMatchByIdUseCase} container.getMatchByIdUseCase - GetMatchByIdUseCase
   */
  constructor({ getMatchByIdUseCase }) {
    this.getMatchByIdUseCase = getMatchByIdUseCase;
  }

  async handle(request, response) {
    const { matchId } = request.params;

    const match = await this.getMatchByIdUseCase.execute(matchId);

    return response.status(200).json(match);
  }
}

module.exports = GetMatchByIdController;
