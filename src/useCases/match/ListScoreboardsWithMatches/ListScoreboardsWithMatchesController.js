const ValidationException = require('../../../exceptions/ValidationException');
const ListScoreboardsWithMatchesUseCase = require('./ListScoreboardsWithMatchesUseCase');

class ListScoreboardWithMatchesController {
  /**
   * ListScoreboardWithMatchesController
   *
   * @class
   * @param {object} container - Container
   * @param {ListScoreboardsWithMatchesUseCase} container.listScoreboardsWithMatchesUseCase - ListScoreboardsWithMatchesUseCase
   */
  constructor({ listScoreboardsWithMatchesUseCase }) {
    this.listScoreboardsWithMatchesUseCase = listScoreboardsWithMatchesUseCase;
  }

  async handle(request, response) {
    const { id: academyId } = response.locals.user.academy;

    if (!academyId) {
      throw new ValidationException('Necessário informar o id da academia');
    }

    const scoreboards = await this.listScoreboardsWithMatchesUseCase.execute(academyId);

    return response.status(200).json(scoreboards);
  }
}

module.exports = ListScoreboardWithMatchesController;
