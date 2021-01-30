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

    const { user } = response.locals;

    const match = await this.getMatchByIdUseCase.execute(Number(matchId), user ? user.academy.id : null);

    return response.status(200).json(match);
  }
}

module.exports = GetMatchByIdController;
